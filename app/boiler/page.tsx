export const metadata = {
  title: "Boiler Room | Hotel Feverna",
  description: "The hum beneath the floorboards. The heart that keeps the ache warm.",
};

export default function BoilerRoom() {
  return (
    <main
      className="relative min-h-screen flex flex-col items-center justify-center text-fevernaGold bg-black"
      style={{
        backgroundImage: "url('/images/boiler.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Warm dim overlay for atmosphere */}
      <div className="absolute inset-0 bg-[rgba(15,10,5,0.45)]" />

      {/* Content */}
      <div className="relative z-10 text-center fade-in-soft">
        <h1 className="text-4xl font-serif mb-6 feverna-glow">Boiler Room</h1>

        <p className="max-w-lg mx-auto text-lg text-fevernaGold/80 feverna-glow">
          Somewhere below the marble and brass, the pipes still sigh.
          <br />
          The Caretaker says the heat never truly goes out —
          <br />
          only waits for a reason to return.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4">
          <a
            href="/hallway0"
            className="text-sm hover:text-white/80 transition text-fevernaGold/60"
          >
            Return to the Ground Floor
          </a>
          <a
            href="/"
            className="text-sm hover:text-white/80 transition text-fevernaGold/60"
          >
            Back to the Lobby
          </a>
        </div>
      </div>
    </main>
  );
}
