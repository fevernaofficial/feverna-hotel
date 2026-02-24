"use client";

import { useEffect, useState } from "react";

type Props = {
  title?: string;
  availableAfterMs?: number; // when the letter becomes clickable (after "Remain")
  startSignal?: number; // increment to start the timer (we use a number so it re-triggers)
  paragraphs: string[];
};

export default function LetterReveal({
  title = "Open the letter",
  availableAfterMs = 10_000,
  startSignal = 0,
  paragraphs,
}: Props) {
  const [available, setAvailable] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setAvailable(false);
    setOpen(false);

    if (!startSignal) return;

    const t = window.setTimeout(() => setAvailable(true), availableAfterMs);
    return () => window.clearTimeout(t);
  }, [startSignal, availableAfterMs]);

  return (
    <section className="mt-6">
      {!open ? (
        <button
          type="button"
          disabled={!available}
          onClick={() => setOpen(true)}
          className={`
            w-full rounded-xl border border-white/10 bg-black/35 backdrop-blur-sm
            px-5 py-4 text-left transition
            ${available ? "hover:bg-black/45 hover:border-white/20" : "opacity-60 cursor-not-allowed"}
          `}
          aria-label={title}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs uppercase tracking-[0.22em] text-white/70">
              {title}
            </span>
            <span className="text-[11px] uppercase tracking-[0.18em] text-fevernaGold/80">
              {available ? "Unseal" : "Sealed"}
            </span>
          </div>
          <p className="mt-2 text-sm text-white/70">
            {available
              ? "A letter has been left for you."
              : "Not yet. Listen a moment longer."}
          </p>
        </button>
      ) : (
        <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm px-5 py-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xs uppercase tracking-[0.22em] text-white/70">
              Letter
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[11px] uppercase tracking-[0.18em] text-white/55 hover:text-fevernaGold transition"
            >
              Fold
            </button>
          </div>

          <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/80">
            {paragraphs.map((p, i) => (
              <p key={i} className="animate-[fevernaInk_700ms_ease-out_1]">
                {p}
              </p>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}