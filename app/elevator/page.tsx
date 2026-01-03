import type { Route } from "next";
import Link from "next/link";

type Floor = {
  code: "G" | "1" | "2";
  label: string;
  href: Route;
  note?: string;
};

const FLOORS: Floor[] = [
  {
    code: "G",
    label: "Ground Floor",
    href: "/hallway0" as Route,
    note: "Public rooms & worldbuilding",
  },
  {
    code: "1",
    label: "The Ache",
    href: "/hallway1" as Route,
    note: "Canon guest rooms (album floor)",
  },
  {
    code: "2",
    label: "Next Current",
    href: "/hallway2" as Route,
    note: "Second wing (in progress)",
  },
];

export default function ElevatorPage() {
  return (
    <main
      className="relative w-full min-h-screen flex items-start justify-center px-6 pt-6 pb-24 sm:py-10 overflow-hidden"
      style={{
        backgroundImage: "url('/images/elevator.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Light overlay (let the image breathe; card handles readability) */}
      <div className="absolute inset-0 pointer-events-none bg-black/20" />
      <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-black/15 via-transparent to-black/35" />

      <div className="relative z-10 w-full max-w-3xl bg-black/55 border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl backdrop-blur-sm fade-in-soft flex flex-col max-h-[calc(100dvh-9rem)]">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-[0.22em] uppercase feverna-glow">
            Elevator
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/80">
            Choose a floor. The doors will not hurry for you.
          </p>
        </header>

        <div className="mt-8 flex-1 min-h-0 overflow-y-auto pr-2">
          <section className="space-y-6 text-sm md:text-base text-white/85 leading-relaxed">
            <div>
              <h2 className="text-xs uppercase tracking-[0.22em] text-white/70">
                Floor Selector
              </h2>
              <p className="mt-2 text-white/80">
                The <span className="text-fevernaGold">Ground Floor</span> holds
                the hotel’s public rooms. Floors above begin the canon corridors.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10" />

            <div className="grid gap-3">
              {FLOORS.map((f) => (
                <Link
                  key={f.code}
                  href={f.href}
                  className="group rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition px-4 py-3"
                >
                  <div className="flex items-center gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-md border border-white/15 bg-black/30 grid place-items-center">
                      <span className="text-sm font-semibold tracking-[0.18em] text-white/85">
                        {f.code}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base md:text-lg text-white/90">
                          {f.label}
                        </span>
                        <span className="text-xs uppercase tracking-[0.2em] text-white/55 group-hover:text-fevernaGold transition">
                          Enter
                        </span>
                      </div>

                      {f.note ? (
                        <div className="mt-1 text-xs md:text-sm text-white/60">
                          {f.note}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10" />

            <p className="text-xs md:text-sm text-white/60">
              Additional floors are sealed for now.
            </p>

            <div className="h-6" />
          </section>
        </div>

        <nav className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link
            href="/hallway0"
            className="feverna-btn w-full sm:w-auto text-center"
          >
            Back to Ground Floor
          </Link>

          <Link href="/" className="feverna-btn w-full sm:w-auto text-center">
            Back to Lobby
          </Link>
        </nav>
      </div>
    </main>
  );
}
