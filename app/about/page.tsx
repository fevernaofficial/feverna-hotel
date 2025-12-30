import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="w-full min-h-screen flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-3xl bg-black/60 border border-white/10 rounded-xl p-6 md:p-10 shadow-2xl backdrop-blur-sm fade-in-soft">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-[0.22em] uppercase feverna-glow">
            About
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/80">
            Hotel Feverna is a fictional hotel and art-space—rooms of worldbuilding,
            corridors of music, and quiet places built for those who ache.
          </p>
        </header>

        <section className="mt-8 space-y-4 text-sm md:text-base text-white/85 leading-relaxed">
          <p>
            You won’t find a required order here. The hotel is meant to be wandered.
            Some doors open into ground-floor spaces—mechanical, sacred, open-air,
            candlelit—where the hotel’s mood takes shape.
          </p>

          <p>
            Other doors will lead to song-rooms as the upper floors come online:
            each track housed like a chamber you can return to when you need it.
          </p>

          <div className="pt-4 border-t border-white/10" />

          <h2 className="text-xs uppercase tracking-[0.22em] text-white/70">
            What you’ll find
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-white/80">
            <li>Rooms with atmosphere, story fragments, and symbolic detail</li>
            <li>Music housed as places, not just tracks</li>
            <li>A Guest Register for quiet notes left behind</li>
            <li>A Gift Shop of curated relics (no loud merch—just artifacts)</li>
          </ul>

          <div className="pt-4 border-t border-white/10" />

          <p className="text-xs md:text-sm text-white/60">
            This is a work of fiction and art. It isn’t here to fix you or explain you—
            only to give the ache somewhere dignified to sit.
          </p>
        </section>

        <nav className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link
            href="/hallway0"
            className="inline-flex items-center justify-center px-5 py-3 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 transition text-sm uppercase tracking-[0.18em]"
          >
            Enter the Rooms
          </Link>

          <Link
            href="/guest"
            className="inline-flex items-center justify-center px-5 py-3 rounded-md border border-white/15 hover:border-white/25 transition text-sm uppercase tracking-[0.18em]"
          >
            Sign the Guest Register
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
