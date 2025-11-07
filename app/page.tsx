export default function Lobby() {
  return (
<main
  className="relative min-h-[calc(100vh-1.5rem)] flex flex-col items-center justify-center text-fevernaGold bg-black overflow-hidden"
  style={{
    backgroundImage: "url('/images/lobby.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
 
<nav className="flex flex-col items-center gap-4 text-xl text-fevernaGold/90 fade-in-soft">
  <a
    href="/hallway0"
    className="hover:text-white transition text-center drop-shadow-[0_0_6px_rgba(166,142,109,0.8)] animate-flicker delay-[0s]"
  >
    To the Rooms
  </a>
  <a
    href="/guest"
    className="hover:text-white transition text-center drop-shadow-[0_0_6px_rgba(166,142,109,0.8)] animate-flicker delay-[1.2s]"
  >
    Guest Register
  </a>
  <a
    href="/gift"
    className="hover:text-white transition text-center drop-shadow-[0_0_6px_rgba(166,142,109,0.8)] animate-flicker delay-[2.4s]"
  >
    Gift Shop
  </a>
</nav>
    </main>
  );
}
