import type { Metadata, Route } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Desk | Hotel Feverna",
  description: "The front desk is quiet. Leave a note, or sign the register.",
};

type DeskLink = {
  href: Route;
  label: string;
  delay: string;
};

const LINKS: readonly DeskLink[] = [
  { href: "/contact" as Route, label: "Leave a Note", delay: "0s" },
  { href: "/guest" as Route, label: "Sign the Register", delay: "1.2s" },
  { href: "/hallway0" as Route, label: "Wander the Ground Floor", delay: "2.4s" },
] as const;

export default function DeskPage() {
  return (
    <main className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/images/desk.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Keep overlays subtle (image already has atmosphere) */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-black/0" />
      <div className="absolute inset-0 z-10 pointer-events-none bg-linear-to-b from-black/5 via-transparent to-black/12" />

      {/* Bell hotspot: silent, in-world discovery */}
      <Link
        href={"/lost-and-found/enter" as Route}
        aria-label="Ring the bell"
        className="
          absolute z-20
          left-1/2 top-[72%] -translate-x-1/2 -translate-y-1/2
          h-[90px] w-[120px]
          cursor-pointer
          rounded-full
          focus:outline-none focus-visible:ring-2
          focus-visible:ring-(--feverna-gold)/60
          focus-visible:ring-offset-2 focus-visible:ring-offset-black/40
        "
      >
        <span className="sr-only">Ring the bell</span>
      </Link>

      {/* Navigation block */}
      <nav
        aria-label="Desk navigation"
        className="absolute z-30 left-1/2 top-[37%] -translate-x-1/2 -translate-y-1/2 w-full max-w-sm px-6 fade-in-soft"
      >
        <div className="rounded-2xl border border-white/15 bg-black/55 backdrop-blur-md shadow-2xl px-6 py-6">
          <div className="flex flex-col items-center gap-3">
            {LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="w-full rounded-md px-4 py-3 feverna-btn transition text-center"
              >
                <span
                  className="animate-flicker-text feverna-glow text-fevernaGold/90"
                  style={{ animationDelay: item.delay }}
                >
                  {item.label}
                </span>
              </Link>
            ))}

            <Link
              href={"/" as Route}
              className="w-full rounded-md px-4 py-3 border border-white/15 bg-black/60 hover:bg-black/70 hover:border-white/25 transition text-center uppercase tracking-[0.18em] text-xs text-white/80"
            >
              Back to the Lobby
            </Link>
          </div>

          <p className="mt-5 text-center text-[10px] uppercase tracking-[0.22em] text-white/55">
            The bell is not for show.
          </p>
        </div>
      </nav>
    </main>
  );
}
