import Link from "next/link";
import RoomPlayer, { RoomVideo } from "../components/RoomPlayer";

const videos: RoomVideo[] = [
  {
    id: "vYKheHUpudk",
    title: "Ashfall — Ritual Cut",
    tag: "Annex",
    note: "A furnace hymn. Industrial ache. Endurance when warmth must be manufactured.",
  },
  {
    id: "y0QIQ2z6bl8",
    title: "Winter in My Bones",
    tag: "Annex",
    note: "A cold-season refusal. The honest kind of quiet bitterness.",
  },
];

export default function BoilerRoomPage() {
  return (
    <main
      className="relative w-full min-h-screen flex items-center justify-center px-6 py-10"
      style={{
        backgroundImage: "url('/images/boiler.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Light overlay (preserve the image; card handles readability) */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-linear-to-b from-black/15 via-transparent to-black/35" />

      <div className="relative z-10 w-full max-w-4xl bg-black/55 border border-white/10 rounded-xl p-6 md:p-10 shadow-2xl backdrop-blur-sm fade-in-soft">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-[0.22em] uppercase feverna-glow">
            Boiler Room
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/80">
            The engine below the hotel. Heat, pressure, and the honest work of staying alive.
          </p>
        </header>

        {/* INTERNAL SCROLL AREA (prevents page scroll while allowing longer content) */}
        <div className="mt-8 max-h-[calc(100vh-18rem)] overflow-y-auto pr-2">
          <section className="space-y-6 text-sm md:text-base text-white/85 leading-relaxed">
            <div>
              <h2 className="text-xs uppercase tracking-[0.22em] text-white/70">
                Purpose
              </h2>
              <p className="mt-2 text-white/80">
                This room belongs to the <span className="text-fevernaGold">Annex</span>—ground-floor spaces
                that hold experiments, side works, and pieces that don’t belong upstairs with the canon
                guest rooms.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10" />

            <RoomPlayer videos={videos} defaultId="vYKheHUpudk" enableAutoRotate />

            <p className="text-xs md:text-sm text-white/60">
              Over time, this room will collect the hotel’s “engine pieces”—industrial experiments,
              endurance tracks, and anything forged rather than performed.
            </p>

            {/* breathing room at bottom so last line isn’t jammed against scrollbar */}
            <div className="h-6" />
          </section>
        </div>

        <nav className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link
            href="/hallway0"
            className="inline-flex items-center justify-center px-5 py-3 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 transition text-sm uppercase tracking-[0.18em]"
          >
            Back to Hallway
          </Link>

          <Link
            href="/chapel"
            className="inline-flex items-center justify-center px-5 py-3 rounded-md border border-white/15 hover:border-white/25 transition text-sm uppercase tracking-[0.18em]"
          >
            Return to the Chapel
          </Link>
        </nav>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.2em] text-white/55 hover:text-fevernaGold transition"
          >
            Back to the Lobby
          </Link>
        </div>
      </div>
    </main>
  );
}
