export const metadata = {
  title: "Ground Floor Hallway | Hotel Feverna",
  description: "Corridors of the Hotel Feverna ground floor.",
};

export default function Hallway0() {
  return (
    <main
      className="min-h-screen flex items-end justify-center pb-10 text-fevernaGold"
      style={{
        backgroundImage: "url('/images/hallway0.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="text-center text-lg backdrop-blur-sm bg-black/50 p-6 rounded">
        <p>Doors line the corridor, each whispering softly.</p>

        <a 
          href="/hallway0/elevator" className="block mt-4 underline hover:text-white"
        >
          Take the Elevator
        </a>
 
        <a href="/" className="block mt-4 underline hover:text-white">
          Return to Lobby
        </a>
      </div>
    </main>
  );
}
