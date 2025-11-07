import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotel Feverna",
  description: "Where beauty, ache, and memory intertwine.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* ✅ Move all structure inside real <body> */}
      <body className="min-h-screen flex flex-col bg-black text-fevernaGold font-sans overflow-x-hidden">
        <main className="flex-grow flex flex-col justify-center items-center">
          {children}
        </main>

<footer
  className="fixed bottom-0 left-0 w-full h-8
             flex items-center justify-center
             text-[11px] text-fevernaGold/80
             bg-[rgba(0,0,0,0.7)] backdrop-blur-sm
             border-t border-fevernaGold/30
             shadow-[0_-2px_10px_rgba(166,142,109,0.15)]
             z-[9999] fade-in-soft"
  style={{ gap: "2rem", letterSpacing: "0.03em" }}
>
  <a href="/about" className="hover:text-fevernaGold transition">About</a>
  <a href="/caretaker" className="hover:text-fevernaGold transition">Caretaker</a>
  <a href="/contact" className="hover:text-fevernaGold transition">Contact</a>
  <a
    href="https://linktr.ee/fevernaofficial"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-fevernaGold transition"
  >
    Socials
  </a>
</footer>

      </body>
    </html>
  );
}
