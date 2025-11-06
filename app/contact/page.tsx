export const metadata = {
  title: "Contact | Hotel Feverna",
  description: "Reach the caretaker of Hotel Feverna.",
};

export default function Contact() {
  return (
    <main className="min-h-screen flex items-center justify-center text-center p-8 bg-black/90">
      <div className="max-w-2xl">
        <h1 className="text-3xl mb-6">Contact</h1>
        <p className="text-lg leading-relaxed mb-4">
          For inquiries, collaborations, or messages to the Caretaker, write to:
        </p>
        <a
          href="mailto:fevernaofficial@gmail.com"
          className="underline hover:text-white transition text-fevernaGold"
        >
          fevernaofficial@gmail.com
        </a>
        <p className="mt-6 text-sm text-neutral-400">
          Replies may take time; the hotel is often quiet between arrivals.
        </p>
      </div>
    </main>
  );
}
