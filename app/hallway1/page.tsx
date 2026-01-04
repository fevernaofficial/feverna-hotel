// app/hallway1/page.tsx
import type { Metadata, Route } from "next";
import Link from "next/link";
import { KeyRound, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "First Floor | Hotel Feverna",
  description:
    "A quieter corridor above the lobby. Canon rooms are prepared in time; the ground floor remains open.",
};

type OpenDoor = {
  name: string;
  href: Route;
  note: string;
  delay: string;
};

type ClosedDoor = {
  name: string;
  note: string;
  delay: string;
};

const OPEN_DOORS: OpenDoor[] = [
  // Add live rooms here later, e.g.:
  // {
  //   name: "Room 101 — The Spark",
  //   href: "/rooms/101" as Route,
  //   note: "A first ignition. A matched flame.",
  //   delay: "0s",
  // },
];

const CLOSED_DOORS: ClosedDoor[] = [
  { name: "Room 101", note: "A song-room. Not yet receiving guests.", delay: "0s" },
  { name: "Room 102", note: "A song-room. The key is being cut.", delay: "1.2s" },
  { name: "Room 103", note: "Reserved for a later hour.", delay: "2.4s" },
  { name: "Room 104", note: "Housekeeping has not finished.", delay: "3.6s" },
];

export default function Hallway1Page() {
  const hasOpenDoors = OPEN_DOORS.length > 0;

  return (
    <main
      className="relative w-full min-h-screen flex items-start justify-center px-6 pt-6 pb-24 sm:py-10 overflow-hidden bg-black"
      style={{
        backgroundImage: "url('/images/hallway-n.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Soft overlays for readability (never block clicks) */}
      <div className="absolute inset-0 pointer-events-none bg-black/20" />
      <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-black/10 via-transparent to-black/30" />

      {/* Candle drift: subtle warm light leak */}
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
            The First Floor
          </h1>

          <p className="mt-3 text-sm md:text-base text-white/80">
            This corridor will house the canon rooms for <span className="text-fevernaGold">The Ache</span>.
          </p>

          <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-white/55">
            {hasOpenDoors ? "Choose a door." : "Some doors are not yet receiving guests."}
          </p>
        </header>

        {/* Friendly orientation for casual visitors */}
        {!hasOpenDoors ? (
          <section className="mt-6 rounded-xl border border-white/10 bg-black/35 p-5">
            <h2 className="text-xs uppercase tracking-[0.22em] text-white/70">
              A note from the desk
            </h2>
            <p className="mt-3 text-sm text-white/80 leading-relaxed">
              Nothing is broken. This floor is simply quiet while its rooms are prepared.
              If you’re visiting for the first time, the hotel’s open doors are on the{" "}
              <span className="text-fevernaGold">Ground Floor</span>.
            </p>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Link href="/hallway0" className="feverna-btn w-full sm:w-auto text-center">
                Return to Ground Floor
              </Link>
              <Link href="/guest" className="feverna-btn w-full sm:w-auto text-center">
                Guest Register
              </Link>
            </div>

            <p className="mt-4 text-xs text-white/60">
              The keys for this corridor are issued in time.
            </p>
          </section>
        ) : null}

        {/* Scrollable door list */}
        <div className="mt-6 flex-1 min-h-0 overflow-y-auto pr-2">
          <nav aria-label="First Floor rooms" className="space-y-3">
            {/* Open doors (when you’re ready) */}
            {OPEN_DOORS.map((door) => (
              <Link
                key={door.href}
                href={door.href}
                className="
                  group block rounded-lg border border-white/10
                  bg-white/5 hover:bg-white/10 hover:border-white/20
                  transition px-4 py-3
                "
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span
                    className="text-lg md:text-xl text-fevernaGold/90 group-hover:text-white transition feverna-glow animate-flicker"
                    style={{ animationDelay: door.delay }}
                  >
                    {door.name}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <span className="sr-only">Enter</span>
                    <span
                      className="
                        inline-flex items-center justify-center w-7 h-7 rounded-full
                        border border-white/10 bg-black/25
                        text-fevernaGold/70 group-hover:text-fevernaGold group-hover:border-white/20
                        transition animate-flicker
                      "
                      style={{ animationDelay: door.delay }}
                    >
                      <KeyRound className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </span>
                </div>

                <div className="mt-1 text-xs md:text-sm text-white/60">{door.note}</div>
              </Link>
            ))}

            {/* Closed doors */}
            {CLOSED_DOORS.map((door) => (
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

                <div className="mt-1 text-xs md:text-sm text-white/50">{door.note}</div>
              </div>
            ))}

            <div className="h-6" />
          </nav>
        </div>

        <p className="mt-4 text-center text-[11px] uppercase tracking-[0.22em] text-white/45">
          Keys are issued in time.
        </p>

        <nav className="mt-5 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link href="/elevator" className="feverna-btn w-full sm:w-auto text-center">
            Call the Elevator
          </Link>

          <Link href="/" className="feverna-btn w-full sm:w-auto text-center">
            Back to Lobby
          </Link>
        </nav>
      </div>
    </main>
  );
}
