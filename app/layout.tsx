import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import GoogleAnalytics from "./components/GoogleAnalytics";
import HotelAtmosphere from "./components/HotelAtmosphere";
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
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}

        <HotelAtmosphere />

        <div className="site-shell">
          <div className="site-content">{children}</div>

          <footer
            className="site-footer fade-in-soft"
            aria-label="Hotel information"
          >
            <Link href="/about" className="site-footer-link">
              About
            </Link>
            <Link href="/caretaker" className="site-footer-link">
              Caretaker
            </Link>
            <Link href="/contact" className="site-footer-link">
              Contact
            </Link>
            <a
              href="https://linktr.ee/fevernaofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer-link"
            >
              Socials
            </a>
          </footer>
        </div>
      </body>
    </html>
  );
}
