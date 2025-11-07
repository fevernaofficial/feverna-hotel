export const metadata = {
  title: "The Elevator | Hotel Feverna",
  description: "A soft hum rises through the shaft. The lights flicker as you choose your destination.",
};

export default function Elevator() {
  return (
    <main
      className="relative h-[100svh] flex flex-col items-center justify-center text-fevernaGold bg-black overflow-hidden"
      style={{
        backgroundImage: "url('/images/elevator.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Soft overlay for mood and readability */}
      <div className="absolute inset-0 bg-[rgba(20,15,5,0.25)]" />

      {/* Main content */}
      <div className="relative z-10 text-center fade-in-soft">
        <h1 className="text-4xl font-serif mb-4 drop-shadow-[0_0_6px_rgba(166,142,109,0.8)]">
          The Elevator
        </h1>
        <p className="mb-8 text-fevernaGold/80">
          A soft hum rises through the shaft. The lights flicker as you choose your destination.
        </p>

        <nav className="flex flex-col items-center gap-3 text-lg">
          <a
            href="/hallway0"
            className="hover:text-white transition feverna-glow animate-flicker delay-[0s]"
          >
            Ground Floor
          </a>
          <a
            href="/hallway1"
            className="hover:text-white transition feverna-glow animate-flicker delay-[1.2s]"
          >
            First Floor
          </a>
          <a
            href="/hallway2"
            className="hover:text-white transition feverna-glow animate-flicker delay-[2.4s]"
          >
            Second Floor
          </a>
          <a
            href="/"
            className="mt-6 text-sm hover:text-white/80 transition text-fevernaGold/60"
          >
            Return to Lobby
          </a>
        </nav>
      </div>
    </main>
  );
}
