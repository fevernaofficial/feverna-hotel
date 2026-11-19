"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

type ContactResponse = {
  ok: boolean;
  message?: string;
};

const FIELD_CLASS =
  "w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-base text-white/85 placeholder:text-white/35 transition focus-visible:border-[rgba(166,142,109,0.75)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(166,142,109,0.9)] sm:rounded-full sm:px-5 sm:text-sm";

const LABEL_CLASS =
  "mb-2 block text-xs uppercase tracking-[0.16em] text-white/75";

const FAILURE_MESSAGE =
  "Your message could not be sent right now. Please try again later or use the direct email address.";

function stampSubmissionTime(form: HTMLFormElement) {
  const timestamp = form.querySelector<HTMLInputElement>('input[name="ts"]');
  if (timestamp) timestamp.value = String(Date.now());
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [showFallback, setShowFallback] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (formRef.current) stampSubmissionTime(formRef.current);
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    submittingRef.current = true;
    setStatus("sending");
    setStatusMessage("Sending your message…");

    const form = event.currentTarget;
    let failureMessage = FAILURE_MESSAGE;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: new FormData(form),
      });

      let data: ContactResponse | null = null;
      try {
        data = (await response.json()) as ContactResponse;
      } catch {
        // A non-JSON response is treated as a generic delivery failure below.
      }

      if (!response.ok || !data?.ok) {
        failureMessage = data?.message || FAILURE_MESSAGE;
        throw new Error("Contact submission failed");
      }

      setStatus("sent");
      setStatusMessage(
        `${data.message || "Your message has been sent."} Replies may arrive from FevernaOfficial.`
      );
      form.reset();
      stampSubmissionTime(form);
    } catch {
      setStatus("error");
      setStatusMessage(failureMessage);
    } finally {
      submittingRef.current = false;
    }
  }

  const isSending = status === "sending";

  return (
    <div className="rounded-xl border border-white/10 bg-black/35 p-4 sm:p-6">
      <h2 className="text-xs uppercase tracking-[0.22em] text-white/70">
        Leave a note
      </h2>
      <p className="mt-2 text-xs leading-relaxed text-white/55">
        Email and message are required. Your email is used only to reply.
      </p>

      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="mt-5 space-y-5"
        aria-busy={isSending}
      >
        <div
          aria-hidden="true"
          className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
        >
          <label htmlFor="contact-company">Company</label>
          <input
            id="contact-company"
            name="company"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <input type="hidden" name="ts" defaultValue="" />

        <div>
          <label htmlFor="contact-name" className={LABEL_CLASS}>
            Name <span className="normal-case tracking-normal text-white/45">(optional)</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={80}
            disabled={isSending}
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label htmlFor="contact-email" className={LABEL_CLASS}>
            Email <span className="normal-case tracking-normal text-fevernaGold">(required)</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={254}
            required
            disabled={isSending}
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label htmlFor="contact-subject" className={LABEL_CLASS}>
            Subject <span className="normal-case tracking-normal text-white/45">(optional)</span>
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            autoComplete="off"
            maxLength={120}
            disabled={isSending}
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label htmlFor="contact-message" className={LABEL_CLASS}>
            Message <span className="normal-case tracking-normal text-fevernaGold">(required)</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            maxLength={5000}
            rows={7}
            disabled={isSending}
            className={`${FIELD_CLASS} resize-y rounded-2xl sm:rounded-2xl`}
          />
        </div>

        <button
          type="submit"
          disabled={isSending}
          className="w-full rounded-full bg-[rgba(166,142,109,0.85)] px-5 py-3 text-sm uppercase tracking-[0.18em] text-black transition hover:bg-[rgba(166,142,109,0.95)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(238,208,160,0.95)] disabled:cursor-wait disabled:opacity-60"
        >
          {isSending ? "Sending…" : "Send message"}
        </button>

        <div className="min-h-5 text-center" aria-atomic="true">
          {(status === "sending" || status === "sent") && (
            <p
              role="status"
              aria-live="polite"
              className="text-xs leading-relaxed text-white/65"
            >
              {statusMessage}
            </p>
          )}

          {status === "error" && (
            <p role="alert" className="text-xs leading-relaxed text-red-300">
              {statusMessage}
            </p>
          )}
        </div>
      </form>

      <div className="mt-5 border-t border-white/10 pt-5 text-center">
        {!showFallback ? (
          <button
            type="button"
            onClick={() => setShowFallback(true)}
            aria-controls="contact-direct-address"
            aria-expanded="false"
            className="text-xs uppercase tracking-[0.2em] text-white/55 transition hover:text-fevernaGold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[rgba(238,208,160,0.95)]"
          >
            Reveal the direct address
          </button>
        ) : (
          <p id="contact-direct-address" className="text-xs text-white/70">
            Direct:{" "}
            <a
              href="mailto:contact@feverna.com"
              className="underline decoration-white/20 underline-offset-4 transition hover:text-fevernaGold hover:decoration-fevernaGold/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[rgba(238,208,160,0.95)]"
            >
              contact@feverna.com
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
