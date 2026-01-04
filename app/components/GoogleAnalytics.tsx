"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!gaId || typeof window.gtag !== "function") return;

    const pagePath = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    window.gtag("event", "page_view", {
      page_path: pagePath,
    });
  }, [gaId, pathname, searchParams]);

  return null;
}
