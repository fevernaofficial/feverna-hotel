export const metadata = {
  title: "First Floor Hallway | Hotel Feverna",
  description: "Upper hallway where the music suites reside.",
};

export default function Hallway1() {
  return (
    <main
      className="min-h-screen flex items-end justify-center pb-10 text-fevernaGold"
      style={{
        backgroundImage: "url('/images/hallway1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="text-center text-lg backdrop-blur-sm bg-black/50 p-6 rounded">
        <p>Soft notes drift from behind the doors.</p>
        <a href="/hallway0/elevator" className="block mt-4 underline hover:text-white">
          Return to Elevator
        </a>
      </div>
    </main>
  );
}
