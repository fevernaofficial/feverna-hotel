import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hotel Feverna",
  description: "A place for those who ache.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* App shell */}
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">{children}</main>

          {/* Global footer */}
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
            <Link href="/about" className="hover:text-fevernaGold transition">
              About
            </Link>
            <Link href="/caretaker" className="hover:text-fevernaGold transition">
              Caretaker
            </Link>
            <Link href="/contact" className="hover:text-fevernaGold transition">
              Contact
            </Link>
            <a
              href="https://linktr.ee/fevernaofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fevernaGold transition"
            >
              Socials
            </a>
          </footer>
        </div>
      </body>
    </html>
  );
}
