"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!gaId || typeof window.gtag !== "function") return;

    // Avoid useSearchParams() to prevent Suspense/CSR-bailout issues during prerender.
    const pagePath = `${window.location.pathname}${window.location.search}`;

    window.gtag("event", "page_view", {
      page_path: pagePath,
    });
  }, [gaId, pathname]);

  return null;
}
