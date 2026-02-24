"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import RoomPlayer, { RoomVideo } from "../RoomPlayer";
import LetterReveal from "./LetterReveal";

type Props = {
  title: string;
  hallwayHref: Route;
  youtubeId: string;
  roomNote?: string;
  letterParagraphs: string[];

  // Timing knobs (defaults match our plan)
  titleAfterMs?: number;
  actionsAfterMs?: number;
  letterAfterMs?: number;
};

export default function SongRoomExperience({
  title,
  hallwayHref,
  youtubeId,
  roomNote,
  letterParagraphs,
  titleAfterMs = 3000,
  actionsAfterMs = 4000,
  letterAfterMs = 10_000,
}: Props) {
  const [showTitle, setShowTitle] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [hasRemained, setHasRemained] = useState(false);

  // Signal for LetterReveal timer (increments when you "remain")
  const [remainSignal, setRemainSignal] = useState(0);

  useEffect(() => {
    const t1 = window.setTimeout(() => setShowTitle(true), titleAfterMs);
    const t2 = window.setTimeout(() => setShowActions(true), actionsAfterMs);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [titleAfterMs, actionsAfterMs]);

  const videos: RoomVideo[] = useMemo(
    () => [
      {
        id: youtubeId,
        title,
        tag: "Canon",
        note: roomNote ?? "A guest room kept for the chapter upstairs.",
      },
    ],
    [youtubeId, title, roomNote]
  );

  function onRemain() {
    if (hasRemained) return;
    setHasRemained(true);
    setRemainSignal((n) => n + 1);

    // Hook for later: tell a global “atmosphere” controller to fade out.
    window.dispatchEvent(
      new CustomEvent("feverna:atmosphere", {
        detail: { action: "fadeOut", seconds: 5 },
      })
    );
  }

  return (
    <div className="relative z-10 mx-auto flex min-h-svh max-w-[760px] flex-col justify-center px-5">
      {/* Title block (appears after a pause) */}
      {showTitle ? (
        <header className="text-center fade-in-soft">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-[0.22em] uppercase feverna-glow text-white/90">
            {title}
          </h1>

          {roomNote ? (
            <p className="mt-3 text-sm md:text-base text-white/70">
              {roomNote}
            </p>
          ) : null}
        </header>
      ) : null}

      {/* Actions near the “foot of the bed” */}
      {showActions ? (
        <div className="mt-8 flex flex-col items-center gap-3 fade-in-soft">
          <button
            type="button"
            onClick={onRemain}
            className="
              w-full max-w-[420px]
              rounded-xl border border-white/10 bg-black/35 backdrop-blur-sm
              px-5 py-4 text-left transition
              hover:bg-black/45 hover:border-white/20
              focus:outline-none focus-visible:ring-2
              focus-visible:ring-(--feverna-gold)/60
              focus-visible:ring-offset-2 focus-visible:ring-offset-black/40
            "
            aria-label="Remain"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs uppercase tracking-[0.22em] text-white/70">
                Remain.
              </span>
              <span className="text-[11px] uppercase tracking-[0.18em] text-fevernaGold/80">
                Enter
              </span>
            </div>
            <p className="mt-2 text-sm text-white/70">
              Stay a moment. Let the room take you.
            </p>
          </button>

          <Link
            href={hallwayHref}
            className="
              text-[11px] uppercase tracking-[0.22em]
              text-white/55 hover:text-fevernaGold transition
            "
          >
            Back to the Hallway
          </Link>
        </div>
      ) : null}

      {/* Song event (only mounts after “Remain”) */}
      {hasRemained ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-black/45 backdrop-blur-sm shadow-2xl p-5 md:p-7 fade-in-soft">
          <RoomPlayer
            videos={videos}
            defaultId={youtubeId}
            enableAutoRotate={false}
          />

          <LetterReveal
            availableAfterMs={letterAfterMs}
            startSignal={remainSignal}
            paragraphs={letterParagraphs}
          />

          <div className="mt-6 flex flex-col items-center gap-3">
            <Link
              href={hallwayHref}
              className="feverna-btn w-full sm:w-auto text-center"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("feverna:atmosphere", {
                    detail: {
                      action: "fadeInAfterSilence",
                      silenceSeconds: 1.5,
                      seconds: 2,
                    },
                  })
                );
              }}
            >
              Return to the Corridor
            </Link>

            <Link
              href={"/" as Route}
              className="text-sm text-white/60 underline underline-offset-4 hover:text-fevernaGold transition"
            >
              Back to the Lobby
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}