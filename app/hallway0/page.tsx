export const metadata = {
  title: "Ground Floor | Hotel Feverna",
  description: "The grand corridor where the rooms of the myth await.",
};

export default function Hallway0() {
  return (
    <main
      className="relative min-h-screen flex flex-col items-center justify-center text-fevernaGold bg-black"
      style={{
        backgroundImage: "url('/images/hallway0.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Soft overlay for readability */}
      <div className="absolute inset-0 bg-[rgba(20,15,5,0.25)]" />

      {/* Main content */}
      <div className="relative z-10 text-center fade-in-soft">
        <h1 className="text-4xl font-serif mb-8 drop-shadow-[0_0_6px_rgba(166,142,109,0.8)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
          The Ground Floor
        </h1>

        <nav className="flex flex-col items-center gap-3 text-xl text-fevernaGold/90">
          <a
            href="/boiler"
            className="hover:text-white transition drop-shadow-[0_0_6px_rgba(166,142,109,0.8)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] animate-flicker delay-[0s]"
          >
            Boiler Room
          </a>
          <a
            href="/chapel"
            className="hover:text-white transition drop-shadow-[0_0_6px_rgba(166,142,109,0.8)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] animate-flicker delay-[1.2s]"
          >
            Chapel
          </a>
          <a
            href="/courtyard"
            className="hover:text-white transition drop-shadow-[0_0_6px_rgba(166,142,109,0.8)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] animate-flicker delay-[2.4s]"
          >
            Courtyard
          </a>
          <a
            href="/solarium"
            className="hover:text-white transition drop-shadow-[0_0_6px_rgba(166,142,109,0.8)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] animate-flicker delay-[3.6s]"
          >
            Solarium
          </a>
          <a
            href="/ballroom"
            className="hover:text-white transition drop-shadow-[0_0_6px_rgba(166,142,109,0.8)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] animate-flicker delay-[4.8s]"
          >
            Ballroom
          </a>
          <a
            href="/elevator"
            className="mt-6 hover:text-white transition drop-shadow-[0_0_6px_rgba(166,142,109,0.8)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] animate-flicker delay-[6s]"
          >
            Elevator
          </a>
          <a
            href="/"
            className="mt-4 text-sm hover:text-white/80 transition text-fevernaGold/60"
          >
            Return to Lobby
          </a>
        </nav>
      </div>
    </main>
  );
}
