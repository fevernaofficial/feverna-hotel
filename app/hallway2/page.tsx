// app/hallway2/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Second Floor | Hotel Feverna",
  description:
    "A sealed floor above the canon corridors. A floor under construction, kept quiet.",
};

const CLOSED_DOORS = [
  { name: "Room 201", note: "The corridor is being measured.", delay: "0s" },
  { name: "Room 202", note: "A lock awaiting its key.", delay: "1.2s" },
  { name: "Room 203", note: "Lights off. Dust settling.", delay: "2.4s" },
] as const;

type ClosedDoor = (typeof CLOSED_DOORS)[number];

export default function Hallway2Page() {
  return (
    <main
      className="relative w-full min-h-screen flex items-start justify-center px-6 pt-6 pb-24 sm:py-10 overflow-hidden bg-black"
      style={{
        backgroundImage: "url('/images/hallway-n.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Soft overlays for readability */}
      <div className="absolute inset-0 pointer-events-none bg-black/20" />
      <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-black/10 via-transparent to-black/30" />

      {/* Candle drift */}
      <div
        className="
          absolute inset-0 pointer-events-none
          opacity-[0.08] mix-blend-screen
          bg-[radial-gradient(60%_60%_at_50%_30%,rgba(166,142,109,0.95),transparent_60%)]
          animate-[candleDrift_14s_ease-in-out_infinite]
        "
      />

      <div className="relative z-10 w-full max-w-xl bg-black/55 border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl backdrop-blur-sm fade-in-soft flex flex-col max-h-[calc(100dvh-9rem)]">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-[0.22em] uppercase feverna-glow">
            The Second Floor
          </h1>

          <p className="mt-3 text-sm md:text-base text-white/80">
            A floor still under construction. The hotel prefers silence while it
            becomes itself.
          </p>

          <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-white/55">
            Not yet receiving guests.
          </p>
        </header>

        <div className="mt-8 flex-1 min-h-0 overflow-y-auto pr-2">
          <nav aria-label="Second Floor rooms" className="space-y-3">
            {CLOSED_DOORS.map((door: ClosedDoor) => (
              <div
                key={door.name}
                className="group block rounded-lg border border-white/10 bg-black/25 px-4 py-3"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span
                    className="text-lg md:text-xl text-white/60 transition feverna-glow animate-flicker"
                    style={{ animationDelay: door.delay }}
                  >
                    {door.name}
                  </span>

                  <span className="inline-flex items-center gap-2 text-white/45">
                    <span className="sr-only">Closed</span>
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-white/10 bg-black/25">
                      <Lock className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </span>
                </div>

                <div className="mt-1 text-xs md:text-sm text-white/50">
                  {door.note}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <p className="mt-4 text-center text-[11px] uppercase tracking-[0.22em] text-white/45">
          Housekeeping is on the stairs.
        </p>

        <nav className="mt-5 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link href="/elevator" className="feverna-btn w-full sm:w-auto text-center">
            Return to Elevator
          </Link>

          <Link href="/" className="feverna-btn w-full sm:w-auto text-center">
            Back to Lobby
          </Link>
        </nav>
      </div>
    </main>
  );
}
