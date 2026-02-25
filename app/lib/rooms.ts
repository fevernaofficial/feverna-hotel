// app/lib/rooms.ts
import type { Route } from "next";
import { ROUTES } from "../routes";

export type LetterKind = "lyric" | "fragment" | "caretaker";

export type CanonRoom = {
  /** Canonical room number (e.g. "101") */
  id: string;

  /** Display title shown in the room */
  title: string;

  /** Which canon floor/chapter this room belongs to */
  floor: number;

  /** Which hallway this room belongs to */
  hallwayHref: Route;

  /** Route to the room page */
  roomHref: Route;

  /** Background image used in the room shell */
  backgroundImage: string;

  /** YouTube video id for embed */
  youtubeId: string;

  /** Short atmospheric note shown under title */
  roomNote?: string;

  /** Letter reveal behavior/content */
  letter: {
    kind: LetterKind;
    title: string;
    unlockDelayMs: number;
    paragraphs: string[];
  };

  /** Optional hooks for future systems */
  flags?: {
    requiresKeyId?: string;
    isPrivate?: boolean;
  };

  /** Optional future atmosphere variation hooks */
  atmosphere?: {
    variant?: string;
  };
};

export const CANON_ROOMS: CanonRoom[] = [
  {
    id: "101",
    title: "Beneath Her Tide",
    floor: 1,
    hallwayHref: ROUTES.hallway1,
    roomHref: ROUTES.theAche101,
    backgroundImage: "/images/beneath-her-tide.webp",
    youtubeId: "QGlz2YfBKmo",
    roomNote: "A gray tide beyond the glass. Warm lamplight within.",
    letter: {
      kind: "lyric",
      title: "Open the letter",
      unlockDelayMs: 10_000,
      paragraphs: [
        "Breath of ocean wind, hand in hand — twilight hush between our steps in sand. Hearts racing; lips met in trembling fire, floating home, tasting first love’s desire.",
        "Couldn’t sleep — too charged from the night before. She knocked while I dreamed, and slipped away from me. Another boy. She looked right through me. The ocean pulled me under. I let it, quietly.",
        "I couldn’t breathe. I couldn’t cry. I turned and walked into the tide.",
        "The sea still calls with hush and roar, and I step in, to ache once more. She holds the ache I cannot share, and she becomes the weight I bear.",
        "The wanting hums behind my wall, fed by songs I can’t recall. I kept it locked for many years — now I feed it songs and tears.",
        "I breathe it in — the ache runs through me, vast and deep, like the endless sea. I breathe it in, but do not drown. Ecstatic joy — I come alive.",
      ],
    },
    atmosphere: {
      variant: "gray-tide",
    },
  },
];

export function getCanonRoomById(id: string): CanonRoom | undefined {
  return CANON_ROOMS.find((r) => r.id === id);
}

export function getCanonRoomsForHallway(hallwayHref: Route): CanonRoom[] {
  return CANON_ROOMS.filter((r) => r.hallwayHref === hallwayHref);
}

export function getCanonRoomsForFloor(floor: number): CanonRoom[] {
  return CANON_ROOMS.filter((r) => r.floor === floor);
}