// app/routes.ts
import type { Route } from "next";

/**
 * Single source of truth for internal routes.
 * Anything you put here becomes “typed-route friendly” everywhere.
 */
export const ROUTES = {
  lobby: "/",
  desk: "/desk",
  hallway0: "/hallway0",
  hallway1: "/hallway1",
  hallway2: "/hallway2",
  elevator: "/elevator",

  boiler: "/boiler",
  chapel: "/chapel",
  courtyard: "/courtyard",
  solarium: "/solarium",
  ballroom: "/ballroom",

  gift: "/gift",
  guest: "/guest",
  contact: "/contact",

  about: "/about",
  caretaker: "/caretaker",

  lostFound: "/lost-and-found",
  lostFoundEnter: "/lost-and-found/enter",
} as const satisfies Record<string, Route>;

/**
 * Typed-route safe helper for query strings.
 * (Typed Routes can be strict about `"/path?x=1"` directly.)
 */
export function routeWithQuery(
  path: Route,
  query: Record<string, string | number | boolean | null | undefined>
) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) continue;
    params.set(k, String(v));
  }
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}
