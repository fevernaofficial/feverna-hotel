import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Hotel Feverna",
  description: "An immersive world of music and myth.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-fevernaGold font-serif">
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow">{children}</main>
          <footer className="bg-black/70 text-sm text-center py-6 border-t border-fevernaGold/30">
            <nav className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/about" className="hover:text-white transition">
                About Feverna
              </Link>
              <Link href="/caretaker" className="hover:text-white transition">
                The Caretaker
              </Link>
              <Link href="/contact" className="hover:text-white transition">
                Contact
              </Link>
              <a
                href="https://linktr.ee/fevernaofficial"
                target="_blank"
                className="hover:text-white transition"
              >
                Socials
              </a>
            </nav>
            <p className="mt-3 opacity-60">
              © {new Date().getFullYear()} Hotel Feverna
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
