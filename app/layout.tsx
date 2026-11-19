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
              About Feverna
            </Link>
            <Link href="/contact" className="site-footer-link">
              Contact
            </Link>
            <details className="site-footer-disclosure">
              <summary className="site-footer-link">Music &amp; Films</summary>
              <div
                className="site-footer-panel"
                aria-label="Feverna music and films"
              >
                <a
                  href="https://www.youtube.com/@Fevernaofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-footer-external-link"
                >
                  <span>Feverna — YouTube</span>
                  <span className="site-footer-external-label">
                    External <span aria-hidden="true">↗</span>
                  </span>
                </a>
                <a
                  href="https://www.youtube.com/@VelvetNocturne7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-footer-external-link"
                >
                  <span>Velvet Nocturne</span>
                  <span className="site-footer-external-label">
                    External <span aria-hidden="true">↗</span>
                  </span>
                </a>
                <a
                  href="https://www.youtube.com/@FevernaCaretakersNocturne"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-footer-external-link"
                >
                  <span>Caretaker&apos;s Nocturne</span>
                  <span className="site-footer-external-label">
                    External <span aria-hidden="true">↗</span>
                  </span>
                </a>
                <a
                  href="https://feverna.bandcamp.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-footer-external-link"
                >
                  <span>Bandcamp</span>
                  <span className="site-footer-external-label">
                    External <span aria-hidden="true">↗</span>
                  </span>
                </a>
                <a
                  href="https://soundcloud.com/fevernaofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-footer-external-link"
                >
                  <span>SoundCloud</span>
                  <span className="site-footer-external-label">
                    External <span aria-hidden="true">↗</span>
                  </span>
                </a>
              </div>
            </details>
          </footer>
        </div>
      </body>
    </html>
  );
}
