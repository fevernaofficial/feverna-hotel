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
    <html lang="en" className="h-full w-full">
      <body className="bg-black text-fevernaGold font-sans overflow-x-hidden min-h-screen flex flex-col justify-between">

        {/* Page content */}
        <main className="flex-grow flex flex-col justify-center items-center">
          {children}
        </main>

        {/* Global footer (always visible) */}
        <footer className="w-full h-6 flex items-center justify-center gap-8 text-[10px] text-fevernaGold/70 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm fade-in-soft">
          <a
            href="/about"
            className="hover:text-fevernaGold transition drop-shadow-[0_0_4px_rgba(166,142,109,0.5)] hover:opacity-90"
          >
            About
          </a>
          <a
            href="/caretaker"
            className="hover:text-fevernaGold transition drop-shadow-[0_0_4px_rgba(166,142,109,0.5)] hover:opacity-90"
          >
            Caretaker
          </a>
          <a
            href="/contact"
            className="hover:text-fevernaGold transition drop-shadow-[0_0_4px_rgba(166,142,109,0.5)] hover:opacity-90"
          >
            Contact
          </a>
          <a
            href="https://linktr.ee/fevernaofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-fevernaGold transition drop-shadow-[0_0_4px_rgba(166,142,109,0.5)] hover:opacity-90"
          >
            Socials
          </a>
        </footer>
      </body>
    </html>
  );
}
