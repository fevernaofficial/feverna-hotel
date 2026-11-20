"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

type GuestRegisterResponse = {
  ok: boolean;
  message?: string;
};

const CONTROL_CLASS =
  "w-full border border-white/15 bg-black/25 text-base text-white/85 transition focus-visible:border-[rgba(166,142,109,0.75)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(166,142,109,0.9)] disabled:opacity-60 sm:text-sm";

const FIELD_CLASS = `${CONTROL_CLASS} rounded-xl px-4 py-3 sm:rounded-full sm:px-5`;

const TEXTAREA_CLASS = `${CONTROL_CLASS} resize-y rounded-2xl px-6 py-5 leading-relaxed sm:rounded-full sm:px-12 sm:py-8`;

const LABEL_CLASS =
  "mb-1 block text-xs uppercase tracking-[0.16em] text-white/75";

const DESCRIPTION_CLASS = "mb-2 text-xs leading-relaxed text-white/50";

const FAILURE_MESSAGE =
  "Your entry could not be delivered right now. Please try again later.";

function stampSubmissionTime(form: HTMLFormElement) {
  const timestamp = form.querySelector<HTMLInputElement>('input[name="ts"]');
  if (timestamp) timestamp.value = String(Date.now());
}

export default function GuestRegisterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");
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
    setStatusMessage("Delivering your entry to the desk…");

    const form = event.currentTarget;
    let failureMessage = FAILURE_MESSAGE;

    try {
      const response = await fetch("/api/guest-register", {
        method: "POST",
        body: new FormData(form),
      });

      let data: GuestRegisterResponse | null = null;
      try {
        data = (await response.json()) as GuestRegisterResponse;
      } catch {
        // A non-JSON response is handled as a generic delivery failure below.
      }

      if (!response.ok || !data?.ok) {
        failureMessage = data?.message || FAILURE_MESSAGE;
        throw new Error("Visitor's Book submission failed");
      }

      setStatus("sent");
      setStatusMessage(
        data.message ||
          "Your entry has been delivered to the desk for manual review."
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
    <>
      <div>
        <h2 className="text-xs uppercase tracking-[0.22em] text-white/70">
          Sign the Visitor&apos;s Book
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/75">
          Entries are reviewed manually. They do not appear immediately, and
          not every submission is published.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-white/55">
          Email is optional and private. It will never appear in a published
          entry. Please keep email addresses and other private contact details
          out of the public message.
        </p>
      </div>

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
          <label htmlFor="guest-company">Company</label>
          <input
            id="guest-company"
            name="company"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <input type="hidden" name="ts" defaultValue="" />

        <div>
          <label htmlFor="guest-name" className={LABEL_CLASS}>
            Name{" "}
            <span className="normal-case tracking-normal text-white/45">
              (optional)
            </span>
          </label>
          <p id="guest-name-description" className={DESCRIPTION_CLASS}>
            May appear with your entry if approved.
          </p>
          <input
            id="guest-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={80}
            disabled={isSending}
            aria-describedby="guest-name-description"
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label htmlFor="guest-room" className={LABEL_CLASS}>
            Room or place{" "}
            <span className="normal-case tracking-normal text-white/45">
              (optional)
            </span>
          </label>
          <p id="guest-room-description" className={DESCRIPTION_CLASS}>
            May appear alongside your published entry.
          </p>
          <input
            id="guest-room"
            name="room"
            type="text"
            autoComplete="off"
            maxLength={80}
            disabled={isSending}
            aria-describedby="guest-room-description"
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label htmlFor="guest-email" className={LABEL_CLASS}>
            Private email{" "}
            <span className="normal-case tracking-normal text-white/45">
              (optional)
            </span>
          </label>
          <p id="guest-email-description" className={DESCRIPTION_CLASS}>
            For a private reply only. Never displayed publicly.
          </p>
          <input
            id="guest-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={254}
            disabled={isSending}
            aria-describedby="guest-email-description"
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label htmlFor="guest-message" className={LABEL_CLASS}>
            Memory or message{" "}
            <span className="normal-case tracking-normal text-fevernaGold">
              (required)
            </span>
          </label>
          <p id="guest-message-description" className={DESCRIPTION_CLASS}>
            Your words may appear in the Visitor&apos;s Book after approval.
            Please omit private contact details.
          </p>
          <textarea
            id="guest-message"
            name="message"
            required
            maxLength={2000}
            rows={6}
            disabled={isSending}
            aria-describedby="guest-message-description"
            className={TEXTAREA_CLASS}
          />
        </div>

        <button
          type="submit"
          disabled={isSending}
          className="w-full rounded-full bg-[rgba(166,142,109,0.85)] px-5 py-3 text-sm uppercase tracking-[0.18em] text-black transition hover:bg-[rgba(166,142,109,0.95)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(238,208,160,0.95)] disabled:cursor-wait disabled:opacity-60"
        >
          {isSending ? "Delivering…" : "Leave your entry"}
        </button>

        <div className="min-h-5 text-center" aria-atomic="true">
          {(status === "sending" || status === "sent") && (
            <p
              role="status"
              aria-live="polite"
              className="text-xs leading-relaxed text-white/70"
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
    </>
  );
}
