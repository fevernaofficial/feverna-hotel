import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const FROM = "Hotel Feverna <contact@feverna.com>";

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Best-effort in-memory rate limiting (good enough for now).
// Note: in serverless, memory may not persist across instances, but it still helps.
const buckets = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_WINDOW = 5;

function getClientIp(req: Request) {
  const xf = req.headers.get("x-forwarded-for");
  if (!xf) return "unknown";
  return xf.split(",")[0]?.trim() || "unknown";
}

export async function POST(req: Request) {
  try {
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return NextResponse.json({ ok: false, error: "Missing RESEND_API_KEY." }, { status: 500 });
    }

    const toEmail = process.env.CONTACT_TO_EMAIL || "fevernaofficial@gmail.com";
    const resend = new Resend(resendKey);

    // Rate limit
    const ip = getClientIp(req);
    const now = Date.now();
    const bucket = buckets.get(ip);

    if (!bucket || bucket.resetAt < now) {
      buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    } else {
      bucket.count += 1;
      if (bucket.count > MAX_PER_WINDOW) {
        return NextResponse.json(
          { ok: false, error: "Too many messages. Please try again later." },
          { status: 429 }
        );
      }
    }

    const form = await req.formData();

    // Honeypot: if filled, pretend success (quietly discard)
    const company = String(form.get("company") ?? "").trim();
    if (company) {
      return NextResponse.json({ ok: true });
    }

    // Time-to-submit check (bots often submit instantly)
    const tsRaw = String(form.get("ts") ?? "").trim();
    const ts = tsRaw ? Number(tsRaw) : NaN;
    if (Number.isFinite(ts)) {
      const elapsed = now - ts;
      if (elapsed < 1500) {
        // under 1.5s is suspicious
        return NextResponse.json({ ok: true });
      }
    }

    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const subject = String(form.get("subject") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    if (!email) {
      return NextResponse.json({ ok: false, error: "Email is required." }, { status: 400 });
    }
    if (!message) {
      return NextResponse.json({ ok: false, error: "Message is required." }, { status: 400 });
    }

    const safeName = escapeHtml(name || "Anonymous");
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject || "—");
    const safeMessage = escapeHtml(message);

    const finalSubject = `Hotel Feverna — Contact${name ? ` (${name})` : ""}${
      subject ? `: ${subject}` : ""
    }`;

    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [toEmail],
      subject: finalSubject,
      replyTo: email, // so you can hit “Reply” in Gmail and answer them directly
      html: `
        <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height: 1.5;">
          <h2 style="margin: 0 0 12px;">New Contact Note</h2>
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
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
