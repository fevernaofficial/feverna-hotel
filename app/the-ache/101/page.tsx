// app/the-ache/101/page.tsx
import type { Metadata } from "next";
import SongRoomExperience from "../../components/songrooms/SongRoomExperience";
import { ROUTES } from "../../routes";

export const metadata: Metadata = {
  title: "Room 101 | Beneath Her Tide | Hotel Feverna",
  description:
    "A room prepared for the ache. Gray tide beyond the glass.",
};

export default function Room101BeneathHerTide() {
  return (
    <main className="relative min-h-svh overflow-hidden bg-black">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/beneath-her-tide.webp')",
        }}
      />

      {/* Very light overlay — do not darken the room */}
      <div className="absolute inset-0 pointer-events-none bg-black/0" />
      <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-black/0 via-transparent to-black/10" />

      <SongRoomExperience
        title="Beneath Her Tide"
        hallwayHref={ROUTES.hallway1}
        youtubeId="QGlz2YfBKmo"
        roomNote="A gray tide beyond the glass. Warm lamplight within."
        letterParagraphs={[
  "Breath of ocean wind, hand in hand — twilight hush between our steps in sand. Hearts racing; lips met in trembling fire, floating home, tasting first love’s desire.",

  "Couldn’t sleep — too charged from the night before. She knocked while I dreamed, and slipped away from me. Another boy. She looked right through me. The ocean pulled me under. I let it, quietly.",

  "I couldn’t breathe. I couldn’t cry. I turned and walked into the tide.",

  "The sea still calls with hush and roar, and I step in, to ache once more. She holds the ache I cannot share, and she becomes the weight I bear.",

  "The wanting hums behind my wall, fed by songs I can’t recall. I kept it locked for many years — now I feed it songs and tears.",

  "I breathe it in — the ache runs through me, vast and deep, like the endless sea. I breathe it in, but do not drown. Ecstatic joy — I come alive.",
]}
      />
    </main>
  );
}