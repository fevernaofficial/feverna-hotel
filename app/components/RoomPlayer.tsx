"use client";

import { useEffect, useMemo, useState } from "react";

export type RoomVideo = {
  id: string;       // YouTube video id
  title: string;
  note?: string;
  tag?: "Ground Floor" | "Canon" | "Passage" | "Relic";
};

function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-white/10 bg-black/30">
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default function RoomPlayer({
  videos,
  defaultId,
  enableAutoRotate = true,
}: {
  videos: RoomVideo[];
  defaultId?: string;
  enableAutoRotate?: boolean;
}) {
  const defaultIndex = useMemo(() => {
    if (!defaultId) return 0;
    const idx = videos.findIndex((v) => v.id === defaultId);
    return idx >= 0 ? idx : 0;
  }, [defaultId, videos]);

  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [autoRotate, setAutoRotate] = useState(false);

  const active = videos[activeIndex];

  useEffect(() => {
    if (!enableAutoRotate) return;
    if (!autoRotate) return;

    const t = setInterval(() => {
      setActiveIndex((i) => (i + 1) % videos.length);
    }, 20000); // 20s per rotation (adjust later)

    return () => clearInterval(t);
  }, [autoRotate, enableAutoRotate, videos.length]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            {active.tag ? (
              <span className="inline-block rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-white/70">
                {active.tag}
              </span>
            ) : null}
            <h3 className="text-lg md:text-xl font-medium text-white/90">
              {active.title}
            </h3>
          </div>
          {active.note ? (
            <p className="mt-1 text-sm text-white/75">{active.note}</p>
          ) : null}
        </div>

        {enableAutoRotate ? (
          <button
            type="button"
            onClick={() => setAutoRotate((v) => !v)}
            className="text-xs uppercase tracking-[0.2em] text-white/60 hover:text-fevernaGold transition"
            aria-pressed={autoRotate}
            title="Auto-rotate featured player"
          >
            {autoRotate ? "Auto: On" : "Auto: Off"}
          </button>
        ) : null}
      </div>

      <YouTubeEmbed id={active.id} title={active.title} />

      <div className="pt-3 border-t border-white/10">
        <h4 className="text-xs uppercase tracking-[0.22em] text-white/70">
          Room Contents
        </h4>

        <div className="mt-3 grid gap-2">
          {videos.map((v, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  setActiveIndex(idx);
                  setAutoRotate(false); // stop rotating once user chooses
                }}
                className={[
                  "text-left rounded-lg border px-3 py-2 transition",
                  isActive
                    ? "border-white/25 bg-white/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10",
                ].join(" ")}
              >
                <div className="flex items-center gap-2">
                  {v.tag ? (
                    <span className="inline-block rounded-full border border-white/15 bg-black/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-white/70">
                      {v.tag}
                    </span>
                  ) : null}
                  <span className="text-sm md:text-base text-white/85">
                    {v.title}
                  </span>
                </div>
                {v.note ? (
                  <div className="mt-1 text-xs text-white/60">{v.note}</div>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
