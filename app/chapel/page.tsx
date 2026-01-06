import Link from "next/link";
import ChapelPlaque from "../components/ChapelPlaque";

export default function ChapelPage() {
  return (
    <main
      className="relative w-full min-h-screen flex items-start justify-center px-6 pt-6 pb-24 sm:py-10"
      style={{
        backgroundImage: "url('/images/chapel.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Light overlay (preserve the image; card handles readability) */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-linear-to-b from-black/15 via-transparent to-black/30" />

      {/* Card: bounded height + internal scroll */}
      <div className="relative z-10 w-full max-w-3xl bg-black/55 border border-white/10 rounded-xl p-6 md:p-10 shadow-2xl backdrop-blur-sm fade-in-soft flex flex-col max-h-[calc(100dvh-9rem)]">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-[0.22em] uppercase feverna-glow">
            Chapel
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/80">
            A room for hush. For vows you don’t speak aloud. For the ache you refuse to cheapen.
          </p>

          {/* Rotating placard */}
          <ChapelPlaque />
        </header>

        {/* Scrollable content area */}
        <div className="mt-8 flex-1 min-h-0 overflow-y-auto pr-2">
          <section className="space-y-4 text-sm md:text-base text-white/85 leading-relaxed">
            <p>
              Candles keep their own time here. Wax, dust, old stone. Something like a prayer remains,
              even after the words are gone.
            </p>

            <p>
              The Chapel belongs to the <span className="text-fevernaGold">Relics</span> of the hotel—small
              texts, symbols, and quiet artifacts meant to set the tone, not fill a playlist.
            </p>

            <div className="pt-4 border-t border-white/10" />

            <h2 className="text-xs uppercase tracking-[0.22em] text-white/70">
              Relics kept here
            </h2>

            <ul className="list-disc pl-5 space-y-2 text-white/80">
              <li>Plaques (short vows, benedictions, and warnings)</li>
              <li>Room etiquette and house rules</li>
              <li>Occasional readings (rare, brief, and restrained)</li>
            </ul>

            <p className="text-xs md:text-sm text-white/60">
              (No performance required. Only a moment of reverence—if you have it.)
            </p>

            <div className="pt-4 border-t border-white/10" />

            <h2 className="text-xs uppercase tracking-[0.22em] text-white/70">
              Etiquette
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-white/80">
              <li>Enter quietly. Leave quietly.</li>
              <li>Don’t explain the feeling to yourself too quickly.</li>
              <li>If you light a candle, let it be for something real.</li>
            </ul>

            <div className="h-6" />
          </section>
        </div>

        {/* Nav stays visible (no clipping on mobile) */}
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
