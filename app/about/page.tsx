import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Feverna | Hotel Feverna",
  description:
    "Feverna is an evolving creative world of original music, imagery, atmospheric films, and fiction.",
};

export default function AboutPage() {
  return (
    <main className="relative flex min-h-screen w-full items-start justify-center overflow-x-hidden bg-black px-5 py-10 sm:items-center sm:px-6 sm:py-14">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_650px_at_50%_22%,rgba(166,142,109,0.11),transparent_62%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.84),rgba(0,0,0,0.96))]"
        aria-hidden="true"
      />

      <article className="relative z-10 w-full max-w-3xl rounded-2xl border border-white/10 bg-black/60 p-6 shadow-2xl backdrop-blur-sm fade-in-soft sm:p-8 md:p-11">
        <header className="text-center">
          <h1 className="font-serif text-2xl font-normal tracking-[0.12em] uppercase feverna-glow sm:text-3xl sm:tracking-[0.18em] md:text-4xl">
            About Feverna
          </h1>
        </header>

        <div className="mt-8 space-y-9 text-[0.95rem] leading-7 text-white/82 md:text-base md:leading-8">
          <section className="space-y-4" aria-label="About Feverna introduction">
            <p>
              Feverna is an evolving creative world of original music, imagery,
              atmospheric films, and fiction.
            </p>

            <p>
              It began with a fascination for beauty that seems to linger just
              beyond our reach—and with a desire to experience, create, and
              share that beauty.
            </p>

            <p>
              At its heart is a sense of longing. Not always for a person, a
              place, or a lost moment, but sometimes simply for something
              beautiful that cannot quite be held.
            </p>
          </section>

          <section className="space-y-4 border-t border-white/10 pt-8">
            <h2 className="font-serif text-xl font-normal tracking-[0.08em] text-fevernaGold md:text-2xl">
              The Hotel
            </h2>

            <p>Hotel Feverna is one doorway into that world.</p>

            <p>
              An old, elegant establishment with an uncertain relationship to
              place and time, the hotel offers spaces to explore, moments to
              inhabit, and histories waiting to be discovered.
            </p>

            <p>
              You are welcome to wander at your own pace. Some rooms invite
              curiosity. Others ask nothing of you but that you stay awhile.
            </p>

            <p>
              The hotel is growing, and more of its rooms and stories will be
              revealed over time.
            </p>

            <p>There is no prescribed path, and no need to hurry.</p>
          </section>

          <section className="space-y-4 border-t border-white/10 pt-8">
            <h2 className="font-serif text-xl font-normal tracking-[0.08em] text-fevernaGold md:text-2xl">
              Beyond the Hotel
            </h2>

            <p>
              Feverna also exists through original songs, visual art, and
              ambient films. Each offers another way of experiencing the world,
              whether independently or as part of a larger connection.
            </p>

            <p>
              The <strong className="font-semibold text-white/92">Music &amp; Films</strong>{" "}
              link below provides access to these works and their respective
              channels.
            </p>
          </section>

          <section className="space-y-4 border-t border-white/10 pt-8">
            <h2 className="font-serif text-xl font-normal tracking-[0.08em] text-fevernaGold md:text-2xl">
              A Note on Sound
            </h2>

            <p>Hotel Feverna is best experienced with sound.</p>

            <p>
              Its rooms have their own quiet atmospheres, and music is woven
              throughout the larger Feverna world. For the fullest experience,
              enable sound in the hotel and on your device.
            </p>

            <p>
              Audio begins after your first interaction with the site, and you
              are always free to turn it off.
            </p>
          </section>

          <section className="space-y-4 border-t border-white/10 pt-8">
            <h2 className="font-serif text-xl font-normal tracking-[0.08em] text-fevernaGold md:text-2xl">
              Behind Feverna
            </h2>

            <p>Feverna is an independent creative project.</p>

            <p>
              Within the fictional hotel,{" "}
              <strong className="font-semibold text-white/92">the Caretaker</strong>{" "}
              is its manager and concierge. The name is also used as a creative
              persona associated with Feverna&apos;s real-world work. These are
              related artistic identities, but not the same fictional
              character.
            </p>

            <p>
              The hotel is imagined. The art, and the invitation to experience
              it, are real.
            </p>
          </section>
        </div>

        <nav
          className="mt-10 border-t border-white/10 pt-7 text-center"
          aria-label="About page navigation"
        >
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.2em] text-white/55 transition hover:text-fevernaGold focus-visible:text-fevernaGold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fevernaGold"
          >
            Back to the Lobby
          </Link>
        </nav>
      </article>
    </main>
  );
}
