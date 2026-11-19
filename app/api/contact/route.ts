import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const FROM = "Hotel Feverna <contact@feverna.com>";
const MAX_BODY_BYTES = 32 * 1024;
const MIN_SUBMIT_MS = 1500;
const MAX_FORM_AGE_MS = 2 * 60 * 60 * 1000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

const SUCCESS_MESSAGE = "Your message has been sent.";
const DELIVERY_FAILURE_MESSAGE =
  "Your message could not be sent right now. Please try again later or use the direct email address.";

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
    // Invalid optional deployment configuration is ignored here and handled
    // separately by the relevant deployment check.
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
      return jsonMessage("This message is too large to submit.", 413);
    }

    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return jsonMessage("This submission could not be read.", 400);
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
        "Too many messages have been submitted. Please try again later.",
        429,
        { "Retry-After": String(rateLimit.retryAfter) }
      );
    }

    const name = getTextField(form, "name");
    const email = getTextField(form, "email");
    const subject = getTextField(form, "subject");
    const message = getTextField(form, "message");

    if (name.length > 80) {
      return jsonMessage("Name must be 80 characters or fewer.", 400);
    }
    if (hasHeaderControlCharacters(name)) {
      return jsonMessage("Name contains unsupported characters.", 400);
    }
    if (!email) {
      return jsonMessage("Email is required.", 400);
    }
    if (!isValidEmail(email)) {
      return jsonMessage("Enter a valid email address.", 400);
    }
    if (subject.length > 120) {
      return jsonMessage("Subject must be 120 characters or fewer.", 400);
    }
    if (hasHeaderControlCharacters(subject)) {
      return jsonMessage("Subject contains unsupported characters.", 400);
    }
    if (!message) {
      return jsonMessage("Message is required.", 400);
    }
    if (message.length > 5000) {
      return jsonMessage("Message must be 5,000 characters or fewer.", 400);
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.error(`[contact:${requestId}] Resend is not configured.`);
      return jsonMessage(DELIVERY_FAILURE_MESSAGE, 503);
    }

    const toEmail = process.env.CONTACT_TO_EMAIL || "fevernaofficial@gmail.com";
    const resend = new Resend(resendKey);

    const displayName = name || "Anonymous";
    const displaySubject = subject || "—";
    const safeName = escapeHtml(displayName);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(displaySubject);
    const safeMessage = escapeHtml(message);

    const emailSubject = `Hotel Feverna — Contact${
      name ? ` (${name})` : ""
    }${subject ? `: ${subject}` : ""}`;

    const text = [
      "New Contact Message",
      "",
      `Name: ${displayName}`,
      `Email: ${email}`,
      `Subject: ${displaySubject}`,
      "",
      "Message:",
      message,
      "",
      "Submitted from the Feverna Contact page.",
    ].join("\n");

    const { error } = await resend.emails.send({
      from: FROM,
      to: [toEmail],
      subject: emailSubject,
      replyTo: email,
      text,
      html: `
        <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height: 1.5;">
          <h2 style="margin: 0 0 12px;">New Contact Message</h2>
          <p style="margin: 0 0 8px;"><strong>Name:</strong> ${safeName}</p>
          <p style="margin: 0 0 8px;"><strong>Email:</strong> ${safeEmail}</p>
          <p style="margin: 0 0 8px;"><strong>Subject:</strong> ${safeSubject}</p>
          <p style="margin: 16px 0 8px;"><strong>Message:</strong></p>
          <div style="padding: 12px; border: 1px solid #ddd; border-radius: 10px; background: #fafafa; white-space: pre-wrap;">${safeMessage}</div>
          <p style="margin-top: 16px; color: #666; font-size: 12px;">
            Submitted from the Feverna Contact page.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error(`[contact:${requestId}] Resend delivery failed.`, {
        name: error.name,
        message: error.message,
      });
      return jsonMessage(DELIVERY_FAILURE_MESSAGE, 502);
    }

    return jsonSuccess();
  } catch (error) {
    console.error(`[contact:${requestId}] Unexpected submission failure.`, {
      name: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : "Unknown failure",
    });
    return jsonMessage(DELIVERY_FAILURE_MESSAGE, 500);
  }
}
