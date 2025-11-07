export const metadata = {
  title: "Ballroom | Hotel Feverna",
  description: "Echoes of a waltz linger in the candlelight.",
};

export default function Ballroom() {
  return (
    <main
      className="relative h-[100svh] flex flex-col items-center justify-center text-fevernaGold bg-black overflow-hidden"
      style={{
        backgroundImage: "url('/images/ballroom.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-black/70 p-6 rounded text-center max-w-md">
        <h1 className="text-3xl mb-4 font-serif">Ballroom</h1>
        <p className="text-lg leading-relaxed mb-4">
          The music has long since faded, but something unseen still moves across
          the floor. The chandeliers sway gently, catching a rhythm only ghosts remember.
        </p>
        <a href="/hallway0" className="block underline hover:text-white transition">
          Return to Hallway
        </a>
      </div>
    </main>
  );
}
