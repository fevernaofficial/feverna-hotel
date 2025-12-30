import type { Metadata } from "next";
import { KeyRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Ground Floor | Hotel Feverna",
  description: "The grand corridor where the rooms of the myth await.",
};

type Door = {
  name: string;
  href: string;
  note: string;
  delay: string; // animation-delay value
};

const DOORS: Door[] = [
  {
    name: "Boiler Room",
    href: "/boiler",
    note: "Heat, pressure, endurance.",
    delay: "0s",
  },
  {
    name: "Chapel",
    href: "/chapel",
    note: "Relics, vows, quiet rules.",
    delay: "1.2s",
  },
  {
    name: "Courtyard",
    href: "/courtyard",
    note: "Ambient installations—like weather.",
    delay: "2.4s",
  },
  {
    name: "Solarium",
    href: "/solarium",
    note: "Soft exceptions. Windowlight ache.",
    delay: "3.6s",
  },
  {
    name: "Ballroom",
    href: "/ballroom",
    note: "Glamour and masks. The public ache.",
    delay: "4.8s",
  },
];

export default function Hallway0() {
  return (
    <main
      className="relative w-full min-h-screen flex items-start justify-center px-6 pt-6 pb-24 sm:py-10"
      style={{
        backgroundImage: "url('/images/hallway0.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Soft overlays for readability */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/30" />

      <div className="relative z-10 w-full max-w-xl bg-black/55 border border-white/10 rounded-xl p-6 md:p-10 shadow-2xl backdrop-blur-sm fade-in-soft flex flex-col max-h-[calc(100dvh-9rem)]">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-[0.22em] uppercase feverna-glow">
            The Ground Floor
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/80">
            Public rooms. Worldbuilding. Side works that don’t belong upstairs.
          </p>
        </header>

        {/* Scrollable door list */}
        <div className="mt-8 flex-1 min-h-0 overflow-y-auto pr-2">
          <nav aria-label="Ground Floor rooms" className="space-y-3">
            {DOORS.map((door) => (
              <a
                key={door.href}
                href={door.href}
                className="group block rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition px-4 py-3"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span
                    className="text-lg md:text-xl text-fevernaGold/90 group-hover:text-white transition feverna-glow animate-flicker"
                    style={{ animationDelay: door.delay }}
                  >
                    {door.name}
                  </span>

                  {/* Keyhole "enter" icon */}
                  <span className="inline-flex items-center gap-2">
                    <span className="sr-only">Enter</span>
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-white/10 bg-black/25 text-fevernaGold/70 group-hover:text-fevernaGold group-hover:border-white/20 transition">
                      <KeyRound className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </span>
                </div>

                <div className="mt-1 text-xs md:text-sm text-white/60">
                  {door.note}
                </div>
              </a>
            ))}

            <div className="h-6" />
          </nav>
        </div>

        <nav className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <a
            href="/"
            className="inline-flex items-center justify-center px-5 py-3 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 transition text-sm uppercase tracking-[0.18em]"
          >
            Back to Lobby
          </a>

          <a
            href="/elevator"
            className="inline-flex items-center justify-center px-5 py-3 rounded-md border border-white/15 hover:border-white/25 transition text-sm uppercase tracking-[0.18em]"
          >
            Take the Elevator
          </a>
        </nav>
      </div>
    </main>
  );
}
