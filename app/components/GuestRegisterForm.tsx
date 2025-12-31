"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function GuestRegisterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);

    try {
      const res = await fetch("/api/guest-register", {
        method: "POST",
        body: formData,
      });

      const data = (await res.json()) as { ok: boolean; error?: string };

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Unable to submit right now.");
      }

      setStatus("sent");
      formEl.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unable to submit right now.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        name="name"
        placeholder="Name (optional)"
        className="w-full rounded-full border border-white/15 bg-black/25 px-5 py-3 text-sm text-white/85 placeholder:text-white/40 outline-none focus:border-white/30"
      />

      <input
        name="room"
        placeholder="Room Number (optional)"
        className="w-full rounded-full border border-white/15 bg-black/25 px-5 py-3 text-sm text-white/85 placeholder:text-white/40 outline-none focus:border-white/30"
      />

      <textarea
        name="message"
        required
        placeholder="Memory or Message"
        rows={4}
        className="w-full rounded-2xl border border-white/15 bg-black/25 px-5 py-3 text-sm text-white/85 placeholder:text-white/40 outline-none focus:border-white/30 resize-none"
      />

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full px-5 py-3 text-sm uppercase tracking-[0.18em] bg-[rgba(166,142,109,0.85)] text-black hover:bg-[rgba(166,142,109,0.95)] transition disabled:opacity-60"
      >
        {status === "sending" ? "Submitting…" : "Submit"}
      </button>

      {/* Tiny UX note (no email field; visitor can include it inside message if desired) */}
      <p className="text-center text-[11px] text-white/55 leading-relaxed">
        If you’d like a reply, include an email address inside your message.
      </p>

      {status === "sent" && (
        <p className="text-center text-xs text-white/70">
          Your entry has been delivered to the desk for approval.
        </p>
      )}

      {status === "error" && (
        <p className="text-center text-xs text-red-300">{error}</p>
      )}
    </form>
  );
}
