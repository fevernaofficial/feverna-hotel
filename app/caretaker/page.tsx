// app/caretaker/page.tsx
import Link from "next/link";

export default function CaretakerPage() {
  return (
    <main className="relative w-full min-h-screen flex items-center justify-center px-6 py-10 overflow-hidden bg-black">
      {/* Deliberate “document room” background (no image needed) */}
      <div className="absolute inset-0 bg-[radial-gradient(900px_650px_at_50%_30%,rgba(166,142,109,0.10),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.85),rgba(0,0,0,0.92))]" />

      <div className="relative z-10 w-full max-w-3xl bg-black/60 border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl backdrop-blur-sm fade-in-soft">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-[0.22em] uppercase feverna-glow">
            The Caretaker
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/80">
            The quiet voice at the front desk. The one who keeps the keys. The one
            who notices when a guest lingers.
          </p>
        </header>

        <section className="mt-8 space-y-4 text-sm md:text-base text-white/85 leading-relaxed">
          <p>
            Within Hotel Feverna, the Caretaker is the attendant and narrator. He
            welcomes guests, introduces rooms, and leaves occasional notes—not to
            explain the hotel away, but to help it feel like a place rather than a
            collection of pages.
          </p>

          <p>
            You may see his voice in room placards, in short commentary, or in quiet
            invitations to step deeper into the halls. He is present, observant, and
            restrained by design.
          </p>

          <div className="pt-4 border-t border-white/10" />

          <h2 className="text-xs uppercase tracking-[0.22em] text-white/70">
            What he does
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-white/80">
            <li>Greets guests and points them toward the rooms</li>
            <li>Curates what is shown and how it is presented</li>
            <li>Offers context sparingly—only when it serves the atmosphere</li>
          </ul>

          <div className="pt-4 border-t border-white/10" />

          <h2 className="text-xs uppercase tracking-[0.22em] text-white/70">
            What he will not do
          </h2>
          <p className="text-white/80">
            He is not Feverna. And he will not reduce the hotel’s mystery to a tidy
            explanation. His role is to guide gently—not to solve you, not to turn
            the hotel into a puzzle, and not to make spectacle of what should remain
            reverent.
          </p>
        </section>

        <nav className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link href="/hallway0" className="feverna-btn w-full sm:w-auto text-center">
            Enter the Rooms
          </Link>

          <Link href="/guest" className="feverna-btn w-full sm:w-auto text-center">
            Guest Register
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
