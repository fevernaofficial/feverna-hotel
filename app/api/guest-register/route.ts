import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const FROM = "Hotel Feverna <register@feverna.com>";
const MAX_BODY_BYTES = 24 * 1024;
const MIN_SUBMIT_MS = 1500;
const MAX_FORM_AGE_MS = 2 * 60 * 60 * 1000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

const SUCCESS_MESSAGE =
  "Your entry has been delivered to the desk for manual review. It will not appear immediately.";
const DELIVERY_FAILURE_MESSAGE =
  "Your entry could not be delivered right now. Please try again later.";

const buckets = new Map<string, { count: number; resetAt: number }>();

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getTextField(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function exceedsBodyLimit(form: FormData) {
  const encoder = new TextEncoder();
  let totalBytes = 0;

  for (const [name, value] of form.entries()) {
    totalBytes += encoder.encode(name).byteLength;
    totalBytes +=
      typeof value === "string" ? encoder.encode(value).byteLength : value.size;

    if (totalBytes > MAX_BODY_BYTES) return true;
  }

  return false;
}

function hasHeaderControlCharacters(value: string) {
  return /[\u0000-\u001f\u007f]/.test(value);
}

function isValidEmail(value: string) {
  if (value.length > 254 || hasHeaderControlCharacters(value)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function addAllowedOrigin(origins: Set<string>, value: string | undefined) {
  if (!value) return;

  try {
    origins.add(new URL(value).origin);
  } catch {
    // Invalid optional deployment configuration is ignored here.
  }
}

function isAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  const allowedOrigins = new Set<string>();
  addAllowedOrigin(allowedOrigins, request.url);
  addAllowedOrigin(allowedOrigins, process.env.NEXT_PUBLIC_SITE_URL);

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) addAllowedOrigin(allowedOrigins, `https://${vercelUrl}`);

  try {
    return allowedOrigins.has(new URL(origin).origin);
  } catch {
    return false;
  }
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function checkRateLimit(ip: string, now: number) {
  const current = buckets.get(ip);

  if (!current || current.resetAt <= now) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { limited: false, retryAfter: 0 };
  }

  if (current.count >= MAX_PER_WINDOW) {
    return {
      limited: true,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return { limited: false, retryAfter: 0 };
}

function jsonMessage(
  message: string,
  status: number,
  headers?: Record<string, string>
) {
  return NextResponse.json(
    { ok: false, message },
    { status, headers: { "Cache-Control": "no-store", ...headers } }
  );
}

function jsonSuccess() {
  return NextResponse.json(
    { ok: true, message: SUCCESS_MESSAGE },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();

  try {
    if (!isAllowedOrigin(request)) {
      return jsonMessage("This submission could not be accepted.", 403);
    }

    const contentType = request.headers.get("content-type")?.toLowerCase() || "";
    if (
      !contentType.startsWith("multipart/form-data") &&
      !contentType.startsWith("application/x-www-form-urlencoded")
    ) {
      return jsonMessage("This submission could not be read.", 415);
    }

    const contentLength = Number(request.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
      return jsonMessage("This entry is too large to submit.", 413);
    }

    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return jsonMessage("This submission could not be read.", 400);
    }

    if (exceedsBodyLimit(form)) {
      return jsonMessage("This entry is too large to submit.", 413);
    }

    const company = getTextField(form, "company");
    if (company) return jsonSuccess();

    const now = Date.now();
    const submittedAt = Number(getTextField(form, "ts"));
    if (!Number.isFinite(submittedAt) || submittedAt <= 0) {
      return jsonMessage("Please refresh the page and try again.", 400);
    }

    const formAge = now - submittedAt;
    if (formAge < MIN_SUBMIT_MS) return jsonSuccess();
    if (formAge > MAX_FORM_AGE_MS) {
      return jsonMessage("Please refresh the page and try again.", 400);
    }

    const rateLimit = checkRateLimit(getClientIp(request), now);
    if (rateLimit.limited) {
      return jsonMessage(
        "Too many entries have been submitted. Please try again later.",
        429,
        { "Retry-After": String(rateLimit.retryAfter) }
      );
    }

    const name = getTextField(form, "name");
    const room = getTextField(form, "room");
    const email = getTextField(form, "email");
    const message = getTextField(form, "message");

    if (name.length > 80) {
      return jsonMessage("Name must be 80 characters or fewer.", 400);
    }
    if (hasHeaderControlCharacters(name)) {
      return jsonMessage("Name contains unsupported characters.", 400);
    }
    if (room.length > 80) {
      return jsonMessage("Room or place must be 80 characters or fewer.", 400);
    }
    if (hasHeaderControlCharacters(room)) {
      return jsonMessage("Room or place contains unsupported characters.", 400);
    }
    if (email && !isValidEmail(email)) {
      return jsonMessage("Enter a valid email address or leave it blank.", 400);
    }
    if (!message) {
      return jsonMessage("Memory or message is required.", 400);
    }
    if (message.length > 2000) {
      return jsonMessage(
        "Memory or message must be 2,000 characters or fewer.",
        400
      );
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.error(`[guest-register:${requestId}] Resend is not configured.`);
      return jsonMessage(DELIVERY_FAILURE_MESSAGE, 503);
    }

    const toEmail = process.env.GUESTBOOK_TO_EMAIL || "fevernaofficial@gmail.com";
    const resend = new Resend(resendKey);

    const displayName = name || "Anonymous";
    const displayRoom = room || "—";
    const displayEmail = email || "Not provided";
    const safeName = escapeHtml(displayName);
    const safeRoom = escapeHtml(displayRoom);
    const safeEmail = escapeHtml(displayEmail);
    const safeMessage = escapeHtml(message);

    const subject = `Hotel Feverna — Visitor's Book Entry${
      name ? ` (${name})` : ""
    }`;

    const text = [
      "New Visitor's Book Entry",
      "",
      "PUBLIC ENTRY CONTENT",
      `Name: ${displayName}`,
      `Room or place: ${displayRoom}`,
      "Memory or message:",
      message,
      "",
      "PRIVATE MODERATION INFORMATION",
      `Email: ${displayEmail}`,
      "",
      "Manual review is required. Do not publish the private email address.",
    ].join("\n");

    const { error } = await resend.emails.send({
      from: FROM,
      to: [toEmail],
      subject,
      ...(email ? { replyTo: email } : {}),
      text,
      html: `
        <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height: 1.5;">
          <h2 style="margin: 0 0 12px;">New Visitor's Book Entry</h2>
          <h3 style="margin: 20px 0 10px;">Public entry content</h3>
          <p style="margin: 0 0 8px;"><strong>Name:</strong> ${safeName}</p>
          <p style="margin: 0 0 8px;"><strong>Room or place:</strong> ${safeRoom}</p>
          <p style="margin: 16px 0 8px;"><strong>Memory / Message:</strong></p>
          <div style="padding: 12px; border: 1px solid #ddd; border-radius: 10px; background: #fafafa; white-space: pre-wrap;">${safeMessage}</div>
          <h3 style="margin: 20px 0 10px;">Private moderation information</h3>
          <p style="margin: 0 0 8px;"><strong>Email:</strong> ${safeEmail}</p>
          <p style="margin-top: 16px; color: #666; font-size: 12px;">
            Manual review is required. Do not publish the private email address.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error(`[guest-register:${requestId}] Resend delivery failed.`, {
        name: error.name,
        message: error.message,
      });
      return jsonMessage(DELIVERY_FAILURE_MESSAGE, 502);
    }

    return jsonSuccess();
  } catch (error) {
    console.error(`[guest-register:${requestId}] Unexpected submission failure.`, {
      name: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : "Unknown failure",
    });
    return jsonMessage(DELIVERY_FAILURE_MESSAGE, 500);
  }
}
