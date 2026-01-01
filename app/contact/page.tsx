import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "../components/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Hotel Feverna",
  description: "Leave a note at the front desk—questions, collaborations, quiet words.",
};

export default function ContactPage() {
  return (
    <main
      className="relative w-full h-svh bg-black overflow-hidden"
      style={{
        backgroundImage: "url('/images/contact.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlays */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-linear-to-b from-black/15 via-transparent to-black/35" />

      {/* content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center px-6">
        <div
          className="
            w-full max-w-3xl
            bg-black/60 border border-white/10 rounded-xl
            shadow-2xl backdrop-blur-sm fade-in-soft
            p-6 md:p-10
            max-h-[calc(100svh-var(--footer-h)-2.5rem)]
            overflow-y-auto
            no-scrollbar
          "
>
          <header className="text-center">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-[0.22em] uppercase feverna-glow">
              Contact
            </h1>
            <p className="mt-4 text-sm md:text-base text-white/80">
              Leave a note at the front desk—questions, collaborations, quiet words.
            </p>
          </header>

          <section className="mt-8 space-y-4 text-sm md:text-base text-white/85 leading-relaxed">
            <p>
              If you’d like to reach the person behind Hotel Feverna, the desk accepts messages here.
              Replies may be slow, but they are always read.
            </p>

            <div className="pt-4 border-t border-white/10" />

            <ContactForm />

            <p className="text-xs md:text-sm text-white/60">
              If you’d rather speak where other guests linger, use the social links in the footer.
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
      </div>
    </main>
  );
}
