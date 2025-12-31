import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const FROM = "Hotel Feverna <register@feverna.com>";

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(req: Request) {
  try {
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return NextResponse.json({ ok: false, error: "Missing RESEND_API_KEY." }, { status: 500 });
    }

    const toEmail = process.env.GUESTBOOK_TO_EMAIL || "fevernaofficial@gmail.com";
    const resend = new Resend(resendKey);

    const form = await req.formData();

    const name = String(form.get("name") ?? "").trim();
    const room = String(form.get("room") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    if (!message) {
      return NextResponse.json({ ok: false, error: "Message is required." }, { status: 400 });
    }

    const safeName = escapeHtml(name || "Anonymous");
    const safeRoom = escapeHtml(room || "—");
    const safeMessage = escapeHtml(message);

    const subject = `Hotel Feverna — Guest Register Entry${name ? ` (${name})` : ""}`;

    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [toEmail],
      subject,
      html: `
        <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height: 1.5;">
          <h2 style="margin: 0 0 12px;">New Guest Register Entry</h2>
          <p style="margin: 0 0 8px;"><strong>Name:</strong> ${safeName}</p>
          <p style="margin: 0 0 8px;"><strong>Room:</strong> ${safeRoom}</p>
          <p style="margin: 16px 0 8px;"><strong>Memory / Message:</strong></p>
          <div style="padding: 12px; border: 1px solid #ddd; border-radius: 10px; background: #fafafa; white-space: pre-wrap;">${safeMessage}</div>
          <p style="margin-top: 16px; color: #666; font-size: 12px;">
            Submitted from the Feverna Guest Register form.
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
