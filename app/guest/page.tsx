import type { Metadata, Route } from "next";
import Link from "next/link";
import GuestRegisterForm from "../components/GuestRegisterForm";

export const metadata: Metadata = {
  title: "Guest Register | Hotel Feverna",
  description: "Leave a name, a room, a memory. The desk will review your entry.",
};

export default function GuestRegisterPage() {
  return (
    <main
      className="
        relative w-full min-h-screen bg-black
        overflow-x-hidden
        bg-[url('/images/guest-register.webp')]
        bg-no-repeat bg-cover
        bg-position-[50%_50%]
      "
    >
      {/* Light overlays (preserve the art; improve legibility) */}
      <div className="absolute inset-0 pointer-events-none bg-black/20" />
      <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-black/10 via-transparent to-black/30" />

      {/* Visually-hidden heading (image already contains the title) */}
      <h1 className="sr-only">Guest Register</h1>

      {/* Content: pushed below baked-in title area */}
      <div
        className="relative z-10 w-full flex justify-center px-6"
        style={{
          paddingTop: "clamp(120px, 18vh, 300px)",
          paddingBottom: "clamp(48px, 8vh, 96px)",
        }}
      >
        <div
          className="
            w-full max-w-5xl
            rounded-2xl border border-white/10
            bg-black/40 backdrop-blur-sm shadow-2xl
            p-6 md:p-10
            fade-in-soft
          "
        >
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left: myth + sample entry */}
            <div className="rounded-xl border border-white/10 bg-black/35 p-6">
              <h2 className="text-xs uppercase tracking-[0.22em] text-white/70">
                A note from the desk
              </h2>

              <p className="mt-3 text-sm text-white/80 leading-relaxed">
                Leave a name if you wish. Leave a room if you have one. Leave a
                memory if you can’t carry it alone. Some entries are kept. Some
                are returned to the guest.
              </p>

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-sm text-white/75 italic leading-relaxed">
                  “I wanted to be held a little bit longer.”
                </p>
                <p className="mt-2 text-sm text-white/65">
                  — Abby, <span className="text-fevernaGold">Solarium</span>
                </p>
              </div>

              <p className="mt-6 text-xs text-white/55">
                (Entries appear in time, once the ink dries.)
              </p>
            </div>

            {/* Right: the form */}
            <div className="rounded-xl border border-white/10 bg-black/35 p-6">
              <GuestRegisterForm />

              <div className="mt-6 flex items-center justify-center gap-3">
                <Link
                  href={"/" as Route}
                  className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm uppercase tracking-[0.18em] border border-white/15 bg-white/5 hover:bg-white/10 transition"
                >
                  Lobby
                </Link>

                <Link
                  href={"/hallway0" as Route}
                  className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm uppercase tracking-[0.18em] border border-white/15 hover:border-white/25 transition"
                >
                  Rooms
                </Link>
              </div>

              {/* Quiet in-world service link */}
              <p className="mt-4 text-center text-[11px] uppercase tracking-[0.18em] text-white/45">
                Lost &amp; Found inquiries are kept in the{" "}
                <Link
                  href={"/lost-and-found/enter" as Route}
                  className="text-fevernaGold/85 underline underline-offset-4 hover:text-fevernaGold transition"
                >
                  ledger
                </Link>
                .
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
