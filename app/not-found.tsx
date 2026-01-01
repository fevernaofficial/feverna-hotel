import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not Found | Hotel Feverna",
  description: "This door is not on any map.",
};

export default function NotFound() {
  return (
    <main
      className="relative w-full min-h-screen bg-black overflow-hidden flex items-center justify-center px-6 py-10"
      style={{
        backgroundImage: "url('/images/not-found.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Soft overlays for readability */}
      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 bg-linear-to-b from-black/15 via-transparent to-black/35" />

      {/* Optional: subtle “candle drift” (felt, not noticed) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(600px 420px at 20% 25%, rgba(166,142,109,0.35), transparent 60%), radial-gradient(520px 380px at 85% 70%, rgba(166,142,109,0.18), transparent 60%)",
          animation: "candleDrift 14s ease-in-out infinite",
        }}
      />

      <div
        className="
          relative z-10 w-full max-w-3xl
          rounded-2xl border border-white/10
          bg-black/50 backdrop-blur-sm shadow-2xl
          p-6 md:p-10
          fade-in-soft
          max-h-[calc(100dvh-6rem)]
          overflow-y-auto
        "
      >
        <header className="text-center">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-[0.22em] uppercase feverna-glow">
            Not Found
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/80">
            This door is not on any map. The key turns—but nothing opens.
          </p>
        </header>

        <div className="mt-8 rounded-xl border border-white/10 bg-black/35 p-6">
          <p className="text-sm md:text-base text-white/80 leading-relaxed">
            If you followed a rumor, it may have changed. If you followed a link,
            it may have been removed. Either way—return to the lobby and try a
            different corridor.
          </p>
        </div>

        <nav className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-3 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 transition text-sm uppercase tracking-[0.18em]"
          >
            Back to Lobby
          </Link>

          <Link
            href="/hallway0"
            className="inline-flex items-center justify-center px-5 py-3 rounded-md border border-white/15 hover:border-white/25 transition text-sm uppercase tracking-[0.18em]"
          >
            To the Rooms
          </Link>
        <Link
        href="/contact"
        className="inline-flex items-center justify-center px-5 py-3 rounded-md border border-white/15 hover:border-white/25 transition text-sm uppercase tracking-[0.18em]"
        >
        Notify the Caretaker
        </Link>
        </nav>
        <p className="mt-4 text-center text-xs text-white/60">
            If this passage should exist, leave a note at the desk and I’ll mark the corridor.
            </p>
        <p className="mt-6 text-center text-[11px] uppercase tracking-[0.22em] text-white/55">
          Enter softly.
        </p>
      </div>
    </main>
  );
}
