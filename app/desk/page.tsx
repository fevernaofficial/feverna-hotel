import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Desk | Hotel Feverna",
  description: "The front desk is quiet. Leave a note, or sign the register.",
};

const deskLinks = [
  { href: "/contact", label: "Leave a Note", delay: "0s" },
  { href: "/guest", label: "Sign the Register", delay: "1.2s" },
  { href: "/hallway0", label: "Wander the Ground Floor", delay: "2.4s" },
] as const;

export default function DeskPage() {
  return (
    <main className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/desk-16x9.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Keep overlays subtle */}
      <div className="absolute inset-0 bg-black/0" />
      <div className="absolute inset-0 bg-linear-to-b from-black/5 via-transparent to-black/10" />

      {/* Navigation block */}
      <nav
        aria-label="Desk navigation"
        className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 w-full max-w-sm px-6 fade-in-soft"
      >
        <div className="rounded-2xl border border-white/12 bg-black/42 backdrop-blur-md shadow-2xl px-6 py-6">
          <div className="flex flex-col items-center gap-3 text-fevernaGold/90">
            {deskLinks.map((item) => (
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

            <Link
              href="/"
              className="w-full rounded-md px-4 py-3 feverna-btn transition text-center uppercase tracking-[0.18em] text-xs text-white/80"
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
