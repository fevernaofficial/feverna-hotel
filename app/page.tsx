import type { Metadata, Route } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lobby | Hotel Feverna",
  description:
    "Enter softly. Speak to the desk, wander the ground floor, or sign the register.",
};

type LobbyLink = {
  href: Route;
  label: string;
  delay: string;
};

const lobbyLinks: readonly LobbyLink[] = [
  { href: "/desk" as Route, label: "Approach the Desk", delay: "0s" },
  { href: "/hallway0" as Route, label: "Wander the Ground Floor", delay: "1.2s" },
  { href: "/guest" as Route, label: "Guest Register", delay: "2.4s" },
] as const;

export default function Lobby() {
  return (
    <main className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/lobby.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Keep these LIGHT (the image already has haze) */}
      <div className="absolute inset-0 bg-black/0" />
      <div className="absolute inset-0 bg-linear-to-b from-black/5 via-transparent to-black/10" />

      {/* Navigation block */}
      <nav
        aria-label="Lobby navigation"
        className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 w-full max-w-sm px-6 fade-in-soft"
      >
        <div className="rounded-2xl border border-white/15 bg-black/45 backdrop-blur-md shadow-2xl px-6 py-6">
          <div className="flex flex-col items-center gap-3 text-fevernaGold/90">
            {lobbyLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="w-full rounded-md px-4 py-3 feverna-btn transition text-center"
              >
                <span
                  className="animate-flicker-text feverna-glow"
                  style={{ animationDelay: item.delay }}
                >
                  {item.label}
                </span>
              </Link>
            ))}

            {/* Gift Shop (with “closed” hanging sign) */}
            <div className="relative w-full">
              <Link
                href={"/gift" as Route}
                className="w-full block rounded-md px-4 py-3 feverna-btn transition text-center"
              >
                <span
                  className="animate-flicker-text feverna-glow"
                  style={{ animationDelay: "3.6s" }}
                >
                  Gift Shop
                </span>
              </Link>

              {/* Hanging sign overlay (doesn't block clicks) */}
              <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-6 flex flex-col items-center">
                <div className="h-3 w-px bg-fevernaGold/35" />
                <div className="origin-top rounded-md border border-fevernaGold/30 bg-black/55 backdrop-blur-sm px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-fevernaGold/90 shadow-lg -rotate-3 animate-[signSway_6s_ease-in-out_infinite]">
                  Gift Shop Closed (for now)
                </div>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-[11px] uppercase tracking-[0.22em] text-white/55">
            Enter softly.
          </p>
        </div>
      </nav>
    </main>
  );
}
