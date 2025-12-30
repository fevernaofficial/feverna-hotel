import Link from "next/link";
import RoomPlayer, { RoomVideo } from "../components/RoomPlayer";

const videos: RoomVideo[] = [
  {
    id: "QpmxKZRKJHM",
    title: "Unfolding",
    tag: "Ground Floor",
    note: "An open-air installation: slow movement, gentle return, weather in the corridors.",
  },
];

export default function CourtyardPage() {
  return (
    <main
      className="relative w-full min-h-screen flex items-start justify-center px-6 pt-6 pb-24 sm:py-10"
      style={{
        backgroundImage: "url('/images/courtyard.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Light overlay (preserve the image; card handles readability) */}
      <div className="absolute inset-0 bg-black/15" />
      <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/25" />

      <div className="relative z-10 w-full max-w-4xl bg-black/55 border border-white/10 rounded-xl p-6 md:p-10 shadow-2xl backdrop-blur-sm fade-in-soft flex flex-col max-h-[calc(100dvh-9rem)]">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-[0.22em] uppercase feverna-glow">
            Courtyard
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/80">
            Open air inside the hotel’s walls. A place for ambient pieces that behave like weather.
          </p>
        </header>

        <div className="mt-8 flex-1 min-h-0 overflow-y-auto pr-2">
          <section className="space-y-6 text-sm md:text-base text-white/85 leading-relaxed">
            <div>
              <h2 className="text-xs uppercase tracking-[0.22em] text-white/70">
                Purpose
              </h2>
              <p className="mt-2 text-white/80">
                The Courtyard belongs to the <span className="text-fevernaGold">Ground Floor</span>—ground-floor rooms
                for installations, interludes, and one-off works. This wing is for pieces that loop well,
                breathe slowly, and feel like presence rather than performance.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10" />

            <RoomPlayer videos={videos} defaultId="QpmxKZRKJHM" enableAutoRotate={false} />

            <div className="pt-4 border-t border-white/10" />

            <h2 className="text-xs uppercase tracking-[0.22em] text-white/70">
              Notes
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-white/80">
              <li>These pieces are meant to be revisited, not “finished.”</li>
              <li>Loop-friendly visuals may be added here over time (Passages).</li>
              <li>If a track belongs upstairs, it will go upstairs. This room doesn’t compete with canon.</li>
            </ul>

            <p className="text-xs md:text-sm text-white/60">
              Over time, the Courtyard will collect ambient installations: rainfall, wind, distance, slow light.
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
