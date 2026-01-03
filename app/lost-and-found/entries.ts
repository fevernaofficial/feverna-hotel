// app/lost-and-found/entries.ts

export type LostFoundEntry = {
  tag: string;          // canonical form, e.g. "K-608"
  displayTag: string;   // what you show on-screen
  letter: string[];     // paragraphs (keeps formatting clean)
  portalHref: string;   // external or internal link
};

export const LOST_FOUND_ENTRIES: Record<string, LostFoundEntry> = {
  "K-608": {
    tag: "K-608",
    displayTag: "K-608",
    letter: [
      "To the guest who listens with their eyes—",
      "You have arrived at the portion of the hotel kept off the public map. Not because it is forbidden, but because it is easily spoiled. It requires a certain quiet to remain what it is.",
      "Here, the Lost & Found ledger is not only for keys.",
      "It is for what slips from the hand when the world grows loud: a thought you meant to keep, a name you could not say, a hope you did not know you were carrying until it fell.",
      "K-608 has been entered, and the account is in order.",
      "If you choose to proceed, do so with the same restraint that brought you here. The hotel remembers how a guest crosses a threshold.",
      "— The Caretaker",
    ],
    // TODO: Replace when ready (Bandcamp / YouTube / etc.)
    portalHref: "/caretaker",
  },
};

export function normalizeTag(raw: string) {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}

export function coerceTag(raw: string) {
  const t = normalizeTag(raw);
  if (t === "608") return "K-608";
  if (t === "K608") return "K-608";
  if (t === "K-608") return "K-608";
  return t;
}

export function getEntry(raw: string) {
  const key = coerceTag(raw);
  return LOST_FOUND_ENTRIES[key] ?? null;
}
