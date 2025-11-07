export const metadata = {
  title: "Second Floor Hallway | Hotel Feverna",
  description: "The suites of the concept album await behind these doors.",
};

export default function Hallway2() {
  return (
    <main
      className="relative h-[100svh] flex flex-col items-center justify-center text-fevernaGold bg-black overflow-hidden"
      style={{
        backgroundImage: "url('/images/hallway2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="text-center text-lg backdrop-blur-sm bg-black/50 p-6 rounded">
        <p>The air here feels soft, as faint music seeps through the doors like memory.</p>

        <a href="/hallway2/thespark" className="block mt-4 underline hover:text-white">
          The Spark
        </a>
        <a href="/hallway2/stirring" className="block mt-4 underline hover:text-white">
          Stirring
        </a>
        <a href="/hallway2/beneathhertide" className="block mt-4 underline hover:text-white">
          Beneath Her Tide
        </a>
        <a href="/hallway2/acrosstheblacksea" className="block mt-4 underline hover:text-white">
          Across the Black Sea
        </a>
        <a href="/hallway2/whiteshores" className="block mt-4 underline hover:text-white">
          White Shores (Benediction)
        </a>
        <a href="/hallway2/farcountry" className="block mt-4 underline hover:text-white">
          The Far Country
        </a>
        <a href="/hallway2/woundofjoy" className="block mt-4 underline hover:text-white">
          The Wound of Joy
        </a>

        <a
          href="/elevator"
          className="block mt-6 underline hover:text-white transition"
        >
          Return to Elevator
        </a>
      </div>
    </main>
  );
}
