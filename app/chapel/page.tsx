export const metadata = {
  title: "Chapel | Hotel Feverna",
  description: "A small sanctuary where silence remembers every prayer.",
};

export default function Chapel() {
  return (
    <main
      className="relative h-[100svh] flex flex-col items-center justify-center text-fevernaGold bg-black overflow-hidden"
      style={{
        backgroundImage: "url('/images/chapel.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-black/70 p-6 rounded text-center max-w-md">
        <h1 className="text-3xl mb-4 font-serif">Chapel</h1>
        <p className="text-lg leading-relaxed mb-4">
          The candles still burn, though no one tends them.  
          A place of stillness, and the weight of unspoken words.
        </p>
        <p className="text-sm text-neutral-400 mb-6">
          Here lies the poem “To the Guest Who Chose to Stay.” (To be added.)
        </p>
        <a href="/hallway0" className="block underline hover:text-white transition">
          Return to Hallway
        </a>
      </div>
    </main>
  );
}
