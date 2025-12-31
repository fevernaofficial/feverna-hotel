"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [showFallback, setShowFallback] = useState(false);

  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    // stamp to help detect instant bot submits
    if (!formRef.current) return;
    const ts = formRef.current.querySelector<HTMLInputElement>('input[name="ts"]');
    if (ts) ts.value = String(Date.now());
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      const data = (await res.json()) as { ok: boolean; error?: string };

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Unable to send right now.");
      }

      setStatus("sent");
      formEl.reset();

      // re-stamp timestamp after reset
      const ts = formEl.querySelector<HTMLInputElement>('input[name="ts"]');
      if (ts) ts.value = String(Date.now());
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unable to send right now.");
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-black/35 p-6">
      <h2 className="text-xs uppercase tracking-[0.22em] text-white/70">
        Leave a note
      </h2>

      <form ref={formRef} onSubmit={onSubmit} className="mt-4 space-y-4">
        {/* Honeypot (bots will often fill it). Keep it out of view and out of tab order. */}
        <div
          aria-hidden="true"
          className="absolute left-[-10000px] top-auto w-px h-px overflow-hidden"
        >
          <label>
            Company
            <input name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        {/* Timestamp field (helps detect insta-bot submits) */}
        <input type="hidden" name="ts" defaultValue="" />

        <input
          name="name"
          placeholder="Name (optional)"
          className="w-full rounded-full border border-white/15 bg-black/25 px-5 py-3 text-sm text-white/85 placeholder:text-white/40 outline-none focus:border-white/30"
        />

        <input
          name="email"
          type="email"
          required
          placeholder="Your email (required)"
          className="w-full rounded-full border border-white/15 bg-black/25 px-5 py-3 text-sm text-white/85 placeholder:text-white/40 outline-none focus:border-white/30"
        />

        <input
          name="subject"
          placeholder="Subject (optional)"
          className="w-full rounded-full border border-white/15 bg-black/25 px-5 py-3 text-sm text-white/85 placeholder:text-white/40 outline-none focus:border-white/30"
        />

        <textarea
          name="message"
          required
          placeholder="Message"
          rows={6}
          className="w-full rounded-2xl border border-white/15 bg-black/25 px-5 py-3 text-sm text-white/85 placeholder:text-white/40 outline-none focus:border-white/30 resize-none"
        />

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-full px-5 py-3 text-sm uppercase tracking-[0.18em] bg-[rgba(166,142,109,0.85)] text-black hover:bg-[rgba(166,142,109,0.95)] transition disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send"}
        </button>

        {status === "sent" && (
          <p className="text-center text-xs text-white/65">
            Your note has been delivered to the desk.
          </p>
        )}

        {status === "error" && (
          <p className="text-center text-xs text-red-300">{error}</p>
        )}
      </form>

      <div className="mt-5 pt-5 border-t border-white/10 text-center">
        {!showFallback ? (
          <button
            type="button"
            onClick={() => setShowFallback(true)}
            className="text-xs uppercase tracking-[0.2em] text-white/55 hover:text-fevernaGold transition"
          >
            If the desk is quiet, reveal the direct address
          </button>
        ) : (
          <p className="text-xs text-white/70">
            Direct:{" "}
            <a
              href="mailto:contact@feverna.com"
              className="hover:text-fevernaGold transition underline decoration-white/20 hover:decoration-fevernaGold/60 underline-offset-4"
            >
              contact@feverna.com
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
