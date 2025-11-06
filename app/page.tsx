export default function Lobby() {
  return (
    <main
      className="relative min-h-[90vh] bg-black text-fevernaGold flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url('/images/lobby.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-5xl font-serif mb-8 tracking-wide">HOTEL FEVERNA</h1>
      <nav className="flex flex-col gap-4 text-xl">
        <a href="/hallway0" className="hover:text-white transition">To the Rooms</a>
        <a href="/guest" className="hover:text-white transition">Guest Register</a>
        <a href="/gift" className="hover:text-white transition">Gift Shop</a>
      </nav>
    </main>
  );
}
