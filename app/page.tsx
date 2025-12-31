export default function Lobby() {
  return (
    <main
      className="relative w-full min-h-screen bg-black overflow-hidden"
      style={{
        backgroundImage: "url('/images/lobby.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/15" />
      <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/25" />

      <nav
        aria-label="Lobby navigation"
        className="absolute left-1/2 -translate-x-1/2 w-full max-w-xs text-center fade-in-soft px-6"
        style={{ top: "320px" }}
      >
        <div className="rounded-xl border border-white/10 bg-black/35 backdrop-blur-sm shadow-2xl px-6 py-6">
          <div className="flex flex-col items-center gap-4 text-lg text-fevernaGold/90">
            <a
              href="/hallway0"
              className="w-full rounded-md px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition feverna-glow animate-flicker"
              style={{ animationDelay: "0s" }}
            >
              To the Rooms
            </a>

            <a
              href="/guest"
              className="w-full rounded-md px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition feverna-glow animate-flicker"
              style={{ animationDelay: "1.2s" }}
            >
              Guest Register
            </a>

            {/* Gift Shop (with “closed” hanging sign) */}
            <div className="relative w-full">
              <a
                href="/gift"
                className="w-full rounded-md px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition feverna-glow animate-flicker"
                style={{ animationDelay: "2.4s" }}
              >
                Gift Shop
              </a>

              {/* Hanging sign overlay (doesn't block clicks) */}
              <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-6 flex flex-col items-center">
                <div className="h-3 w-px bg-fevernaGold/35" />
                <div className="origin-top rounded-md border border-fevernaGold/30 bg-black/55 backdrop-blur-sm px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-fevernaGold/90 shadow-lg -rotate-3 animate-[signSway_6s_ease-in-out_infinite]">
                  Gift Shop Closed (for now)
                </div>
              </div>
            </div>
          </div>

          <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-white/55">
            Enter softly.
          </p>
        </div>
      </nav>
    </main>
  );
}
