import type { MetadataRoute } from "next";

function getBaseUrl() {
  // Preferred: set NEXT_PUBLIC_SITE_URL in Vercel (e.g. https://www.feverna.com)
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  // Vercel provides VERCEL_URL like "myapp.vercel.app"
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`.replace(/\/$/, "");

  // Local dev fallback
  return "http://localhost:3000";
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Keep ARG / hidden mechanics out of search results
          "/lost-and-found",
          "/lost-and-found/*",

          // Keep API endpoints out of search results
          "/api",
          "/api/*",

          // Optional: keep form page out of search results (your call)
          "/guest",
          "/guest/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
