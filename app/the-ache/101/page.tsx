// app/the-ache/101/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SongRoomExperience from "../../components/songrooms/SongRoomExperience";
import { getCanonRoomById } from "../../lib/rooms";

export const metadata: Metadata = {
  title: "Room 101 | Beneath Her Tide | Hotel Feverna",
  description: "A room prepared for the ache. Gray tide beyond the glass.",
};

export default function Room101BeneathHerTide() {
  const room = getCanonRoomById("101");
  if (!room) return notFound();

  return (
    <main className="relative min-h-svh overflow-hidden bg-black">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${room.backgroundImage}')`,
        }}
      />

      {/* Very light overlay — do not darken the room */}
      <div className="absolute inset-0 pointer-events-none bg-black/0" />
      <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-black/0 via-transparent to-black/10" />

      <SongRoomExperience
        title={room.title}
        hallwayHref={room.hallwayHref}
        youtubeId={room.youtubeId}
        roomNote={room.roomNote}
        letterTitle={room.letter.title}
        letterParagraphs={room.letter.paragraphs}
        letterAfterMs={room.letter.unlockDelayMs}
      />
    </main>
  );
}