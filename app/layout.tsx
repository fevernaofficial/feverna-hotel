import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import GoogleAnalytics from "./components/GoogleAnalytics";
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
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
      <head>
        {/* Google Analytics (GA4) */}
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  anonymize_ip: true,
                  send_page_view: false
                });
              `}
            </Script>
          </>
        ) : null}
      </head>

      <body>
        {/* Tracks SPA route changes as pageviews */}
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}

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
                       z-9999 fade-in-soft"
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
