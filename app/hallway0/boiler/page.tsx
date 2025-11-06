export const metadata = {
  title: "Boiler Room | Hotel Feverna",
  description: "The heart of the hotel hums quietly beneath the halls.",
};

export default function BoilerRoom() {
  return (
    <main
      className="min-h-screen flex items-end justify-center pb-10 text-fevernaGold"
      style={{
        backgroundImage: "url('/images/boiler.png')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }}
    >
      <div className="bg-black/70 p-6 rounded text-center max-w-md">
        <h1 className="text-3xl mb-4 font-serif">Boiler Room</h1>
        <p className="text-lg leading-relaxed mb-4">
          The old pipes breathe with a slow, steady rhythm—heat and heartbeat,
          echoing through the bones of the hotel.
        </p>
        <p className="text-sm text-neutral-400 mb-6">
          You could swear the metal is whispering.
        </p>
        <a
          href="/hallway0"
          className="block underline hover:text-white transition"
        >
          Return to Hallway
        </a>
      </div>
    </main>
  );
}
