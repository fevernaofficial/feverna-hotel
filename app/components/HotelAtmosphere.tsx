"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type AtmosphereEvent =
  | { action: "fadeOut"; seconds?: number }
  | { action: "fadeIn"; seconds?: number }
  | { action: "fadeInAfterSilence"; silenceSeconds?: number; seconds?: number }
  | { action: "stop" };

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export default function HotelAtmosphere() {
  const pathname = usePathname();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startedRef = useRef(false);

  const [enabled] = useState(true);

  // Breath zones: lobby + hallways + elevator
const isBreathZone = useMemo(() => {
  // Lobby + hallways + elevator are always breath zones.
  // Canon room routes are ALSO breath zones until "Remain" triggers fadeOut.
  return (
    pathname === "/" ||
    pathname.startsWith("/hallway") ||
    pathname.startsWith("/elevator") ||
    pathname.startsWith("/the-ache") ||
    pathname.startsWith("/next-current")
  );
}, [pathname]);

  function cancelRaf() {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }

  function fadeTo(target: number, seconds: number) {
    const el = audioRef.current;
    if (!el) return;

    cancelRaf();

    const startVol = el.volume;
    const endVol = clamp01(target);
    const durationMs = Math.max(50, seconds * 1000);
    const start = performance.now();

    const tick = (now: number) => {
      const t = clamp01((now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out
      el.volume = startVol + (endVol - startVol) * eased;

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
        if (endVol === 0) el.pause();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }

  async function ensureStarted() {
    const el = audioRef.current;
    if (!el) return;
    if (!enabled) return;
    if (startedRef.current) return;

    startedRef.current = true;

    try {
      el.loop = true;
      el.volume = 0;
      await el.play();
      fadeTo(0.18, 2.0); // base level + fade-in
    } catch {
      startedRef.current = false;
    }
  }

  // Start only after the first user gesture (hybrid)
  useEffect(() => {
    if (!enabled) return;

    const onFirstGesture = () => {
      if (!isBreathZone) return;
      ensureStarted();
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };

    window.addEventListener("pointerdown", onFirstGesture);
    window.addEventListener("keydown", onFirstGesture);

    return () => {
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };
  }, [enabled, isBreathZone]);

  // Fade out when leaving breath zones; fade in when returning
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    if (!enabled) {
      cancelRaf();
      el.pause();
      el.currentTime = 0;
      startedRef.current = false;
      return;
    }

    if (!isBreathZone) {
      fadeTo(0, 5.0);
      return;
    }

    if (startedRef.current) {
      try {
        el.play().catch(() => {});
      } catch {}
      fadeTo(0.18, 2.0);
    }
  }, [pathname, enabled, isBreathZone]);

  // Respond to room events (fade out/in)
  useEffect(() => {
    const handler = (e: Event) => {
      const el = audioRef.current;
      if (!el) return;
      if (!enabled) return;

      const detail = (e as CustomEvent<AtmosphereEvent>).detail;
      if (!detail) return;

      if (detail.action === "fadeOut") {
        fadeTo(0, detail.seconds ?? 5);
      }

      if (detail.action === "fadeIn") {
        if (!startedRef.current) ensureStarted();
        try {
          el.play().catch(() => {});
        } catch {}
        fadeTo(0.18, detail.seconds ?? 2);
      }

      if (detail.action === "fadeInAfterSilence") {
        const silence = detail.silenceSeconds ?? 1.5;
        const seconds = detail.seconds ?? 2;
        fadeTo(0, 0.3);
        window.setTimeout(() => {
          if (!startedRef.current) ensureStarted();
          try {
            el.play().catch(() => {});
          } catch {}
          fadeTo(0.18, seconds);
        }, Math.max(0, silence * 1000));
      }

      if (detail.action === "stop") {
        cancelRaf();
        el.pause();
        el.currentTime = 0;
        startedRef.current = false;
      }
    };

    window.addEventListener("feverna:atmosphere", handler as EventListener);
    return () => window.removeEventListener("feverna:atmosphere", handler as EventListener);
  }, [enabled]);

  return <audio ref={audioRef} src="/audio/breath.mp3" preload="auto" />;
}