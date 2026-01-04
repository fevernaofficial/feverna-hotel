import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gift Shop | Hotel Feverna",
  description: "Relics and curios from the halls of Feverna.",
};

export default function GiftShopPage() {
  return (
    <main
      className="relative w-full min-h-screen bg-black overflow-hidden"
      style={{
        backgroundImage: "url('/images/giftshop.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Image already contains the visible title */}
      <h1 className="sr-only">Gift Shop</h1>

      {/* Small status + navigation, placed away from the door sign */}
      <div className="absolute left-5 bottom-16 md:left-10 md:bottom-20 z-10">
        <div className="rounded-2xl border border-white/10 bg-black/45 backdrop-blur-sm shadow-2xl px-5 py-4 fade-in-soft max-w-[18rem]">
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/65">
            Closed for renovations
          </p>

          <div className="mt-3 flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs uppercase tracking-[0.18em] border border-white/15 bg-white/5 hover:bg-white/10 transition"
            >
              Lobby
            </Link>

            <Link
              href="/hallway0"
              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs uppercase tracking-[0.18em] border border-white/15 hover:border-white/25 transition"
            >
              Rooms
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
