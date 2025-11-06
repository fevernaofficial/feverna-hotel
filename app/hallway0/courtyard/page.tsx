export const metadata = {
  title: "Courtyard | Hotel Feverna",
  description: "An open space beneath the unseen stars.",
};

export default function Courtyard() {
  return (
    <main
      className="min-h-screen flex items-end justify-center pb-10 text-fevernaGold"
      style={{
        backgroundImage: "url('/images/courtyard.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-black/70 p-6 rounded text-center max-w-md">
        <h1 className="text-3xl mb-4 font-serif">Courtyard</h1>
        <p className="text-lg leading-relaxed mb-4">
          The air is cool here, touched by sea wind and memory.  
          The stones remember each footstep that has crossed them.
        </p>
        <p className="text-sm text-neutral-400 mb-6">
          You can almost hear waves beyond the walls.
        </p>
        <a href="/hallway0" className="block underline hover:text-white transition">
          Return to Hallway
        </a>
      </div>
    </main>
  );
}
