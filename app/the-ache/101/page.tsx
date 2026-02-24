// app/the-ache/101/page.tsx
import type { Metadata } from "next";
import SongRoomExperience from "../../components/songrooms/SongRoomExperience";
import { ROUTES } from "../../routes";

export const metadata: Metadata = {
  title: "Room 101 | Beneath Her Tide | Hotel Feverna",
  description: "A room prepared for the ache. Gray tide beyond the glass.",
};

export default function Room101BeneathHerTide() {
  return (
    <main className="relative min-h-svh overflow-hidden bg-black">
      {/* Background image only */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          // Save your generated image as /public/images/beneath-her-tide.webp (recommended)
          backgroundImage: "url('/images/beneath-her-tide.webp')",
        }}
      />

      {/* Keep overlays extremely light; let the room speak */}
      <div className="absolute inset-0 pointer-events-none bg-black/0" />
      <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-black/0 via-transparent to-black/10" />

      <SongRoomExperience
        title="Beneath Her Tide"
        hallwayHref={ROUTES.hallway1}
        youtubeId="REPLACE_WITH_YOUTUBE_ID"
        roomNote="A gray tide beyond the glass. Warm lamplight within."
        letterParagraphs={[
          // Replace with your lyrics, formatted as paragraphs.
          // Keep them as paragraphs (not lines) for readability.
          "…",
          "…",
        ]}
      />
    </main>
  );
}