"use client";

import { useMemo, useState } from "react";

const PLAQUES: string[] = [
  "The Chapel does not demand belief. Only reverence.",
  "Some longings are not meant to be satisfied—only kept clean.",
  "If you came here to be entertained, you took the wrong door.",
  "Light is allowed to be small here. It only needs to be real.",
  "Leave the explanation outside. Bring only what you can carry quietly.",
  "This room is for vows you can’t keep—and prayers you won’t pretend.",
];

function pickRandomIndex(max: number) {
  return Math.floor(Math.random() * max);
}

export default function ChapelPlaque() {
  const initialIndex = useMemo(() => pickRandomIndex(PLAQUES.length), []);
  const [index, setIndex] = useState(initialIndex);

  return (
    <div className="mt-6 rounded-lg border border-white/10 bg-black/35 p-4 md:p-5">
      <p className="text-sm md:text-base text-white/85 leading-relaxed">
        <span className="text-fevernaGold uppercase tracking-[0.22em] text-[10px] mr-2">
          Plaque
        </span>
        {PLAQUES[index]}
      </p>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => setIndex(pickRandomIndex(PLAQUES.length))}
          className="text-xs uppercase tracking-[0.2em] text-white/60 hover:text-fevernaGold transition"
        >
          Another
        </button>
      </div>
    </div>
  );
}
