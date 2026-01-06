import Link from "next/link";
import RoomPlayer, { RoomVideo } from "../components/RoomPlayer";

const videos: RoomVideo[] = [
  {
    id: "VrEMmupxAc4",
    title: "The Spark",
    tag: "Ground Floor",
    note: "The moment the hotel wakes up. Glamour, ache, and a doorway that feels like destiny.",
  },
  {
    id: "g0TRwCmT4j0",
    title: "Still Behind the Glass",
    tag: "Ground Floor",
    note: "Witch-house instrumental. A waltz you can’t quite join—seen, not touched.",
  },
];

export default function BallroomPage() {
  return (
    <main
      className="relative w-full min-h-screen flex items-start justify-center px-6 pt-6 pb-24 sm:py-10"
      style={{
        backgroundImage: "url('/images/ballroom.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Light overlay (let the image breathe; card handles readability) */}
      <div className="absolute inset-0 bg-black/15" />
      <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/25" />

      <div className="relative z-10 w-full max-w-4xl bg-black/55 border border-white/10 rounded-xl p-6 md:p-10 shadow-2xl backdrop-blur-sm fade-in-soft flex flex-col max-h-[calc(100dvh-9rem)]">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-[0.22em] uppercase feverna-glow">
            Ballroom
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/80">
            A room for elegance and performance—where the ache learns to wear a mask.
          </p>
        </header>

        <div className="mt-8 flex-1 min-h-0 overflow-y-auto pr-2">
          <section className="space-y-6 text-sm md:text-base text-white/85 leading-relaxed">
            <div>
              <h2 className="text-xs uppercase tracking-[0.22em] text-white/70">
                Purpose
              </h2>
              <p className="mt-2 text-white/80">
                The Ballroom belongs to the <span className="text-fevernaGold">Ground Floor</span>—public rooms
                where pieces can be hosted without being forced into the upstairs canon. This room holds the
                hotel’s “public-facing” ache: glamour, pulse, distance, and a hint of ceremony.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10" />

            <RoomPlayer
              videos={videos}
              defaultId="VrEMmupxAc4"
              enableAutoRotate
            />

            <div className="pt-4 border-t border-white/10" />

            <h2 className="text-xs uppercase tracking-[0.22em] text-white/70">
              House rules
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-white/80">
              <li>Keep your composure. Let the music fail you in private.</li>
              <li>Don’t confuse attention with intimacy.</li>
              <li>If you feel a pull toward the stage, remember: not every spark is a flame.</li>
            </ul>

            <p className="text-xs md:text-sm text-white/60">
              Over time, this room may collect live versions, remixes, and “public sets” that still belong to Feverna’s night.
            </p>

            <div className="h-6" />
          </section>
        </div>

        <nav className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link
            href="/hallway0"
            className="inline-flex items-center justify-center px-5 py-3 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 transition text-sm uppercase tracking-[0.18em]"
          >
            Back to Hallway
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-3 rounded-md border border-white/15 hover:border-white/25 transition text-sm uppercase tracking-[0.18em]"
          >
            Back to Lobby
          </Link>
        </nav>
      </div>
    </main>
  );
}
