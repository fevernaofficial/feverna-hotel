export const metadata = {
  title: "Solarium | Hotel Feverna",
  description: "A room of light where shadows rest quietly.",
};

export default function Solarium() {
  return (
    <main
      className="min-h-screen flex items-end justify-center pb-10 text-fevernaGold"
      style={{
        backgroundImage: "url('/images/solarium.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-black/60 p-6 rounded text-center max-w-md">
        <h1 className="text-3xl mb-4 font-serif">Solarium</h1>
        <p className="text-lg leading-relaxed mb-4">
          The glass ceiling is fractured but still holds the sunlight.  
          Dust drifts like gold through the air, as though time itself has slowed.
        </p>
        <p className="text-sm text-neutral-400 mb-6">
          You linger here longer than you meant to.
        </p>
        <a href="/hallway0" className="block underline hover:text-white transition">
          Return to Hallway
        </a>
      </div>
    </main>
  );
}
