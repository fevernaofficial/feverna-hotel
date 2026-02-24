import type { MetadataRoute } from "next";

function getBaseUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`.replace(/\/$/, "");

  return "http://localhost:3000";
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const now = new Date();

  const routes = [
    "/",
    "/desk",
    "/guest",
    "/gift",
    "/contact",
    "/about",
    "/caretaker",
    "/hallway0",
    "/hallway1",
    "/hallway2",
    "/elevator",
    "/boiler",
    "/chapel",
    "/courtyard",
    "/solarium",
    "/ballroom",
  ] as const;

  return routes.map((path) => ({
    url: new URL(path, baseUrl).toString(),
    lastModified: now.toISOString(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}