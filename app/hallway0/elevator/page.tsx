export const metadata = {
  title: "Elevator | Hotel Feverna",
  description: "A quiet space between floors at Hotel Feverna.",
};

export default function Elevator() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-end pb-10 text-fevernaGold"
      style={{
        backgroundImage: "url('/images/elevator.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-black/60 p-6 rounded text-center max-w-md mb-10">
        <h1 className="text-3xl mb-4 font-serif">The Elevator</h1>
        <p className="text-lg mb-6">
          A soft hum rises through the shaft. The lights flicker as you choose
          your destination.
        </p>

        <div className="flex flex-col gap-3">
          <a
            href="/hallway0"
            className="underline hover:text-white transition"
          >
            Ground Floor
          </a>
          <a
            href="/hallway1"
            className="underline hover:text-white transition"
          >
            First Floor
          </a>
          <a href="/" className="underline hover:text-white transition">
            Lobby
          </a>
        </div>
      </div>
    </main>
  );
}
