// app/lost-and-found/enter/route.ts
import { NextResponse } from "next/server";
import { getEntry } from "../entries";

const COOKIE_NAME = "feverna_lostfound_tag";

export function GET(req: Request) {
  const url = new URL(req.url);
  const tag = url.searchParams.get("tag") ?? "K-608";

  const entry = getEntry(tag);

  // If someone hits /enter with nonsense, just send them to the public page.
  if (!entry) {
    return NextResponse.redirect(new URL("/lost-and-found", url));
  }

  const res = NextResponse.redirect(new URL("/lost-and-found", url));
  res.cookies.set(COOKIE_NAME, entry.tag, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 6, // 6 hours
  });
  return res;
}
