export const metadata = {
  title: "Guest Register | Hotel Feverna",
  description: "Messages and notes from those who passed through.",
};

export default function GuestRegister() {
  return (
    <main
      className="min-h-screen flex items-end justify-center pb-10 text-fevernaGold"
      style={{
        backgroundImage: "url('/images/guest-register.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-black/60 p-8 rounded text-center max-w-md">
        <h2 className="text-2xl mb-4 font-serif">Guest Register</h2>
        <p className="mb-2">Send your message to the Caretaker:</p>
        <a
          href="mailto:fevernaofficial@gmail.com"
          className="underline hover:text-white"
        >
          fevernaofficial@gmail.com
        </a>
        <p className="mt-6 text-sm text-neutral-400">
          Selected entries may appear here after review.
        </p>
        <a href="/" className="block mt-6 underline hover:text-white">
          Return to Lobby
        </a>
      </div>
    </main>
  );
}
