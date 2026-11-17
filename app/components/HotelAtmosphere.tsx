"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  HOTEL_ATMOSPHERE_EVENT,
  type AtmosphereEnvironment,
  type AtmosphereEvent,
} from "../lib/atmosphere";

const INTERIOR_VOLUME = 0.18;

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export default function HotelAtmosphere() {
  const pathname = usePathname();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startedRef = useRef(false);
  const environmentRef = useRef<AtmosphereEnvironment>("interior");
  const enabledRef = useRef(true);

  const [enabled, setEnabled] = useState(true);

  // Lobby + hallways + elevator are always breath zones.
  // Canon room routes are also breath zones until "Remain" triggers fadeOut.
  const isInteriorRoute = useMemo(() => {
    return (
      pathname === "/" ||
      pathname.startsWith("/guest") ||
      pathname.startsWith("/library") ||
      pathname.startsWith("/hallway") ||
      pathname.startsWith("/elevator") ||
      pathname.startsWith("/the-ache") ||
      pathname.startsWith("/next-current")
    );
  }, [pathname]);

  const cancelRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const fadeTo = useCallback((target: number, seconds: number) => {
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
  }, [cancelRaf]);

  const ensureStarted = useCallback(async (force = false) => {
    const el = audioRef.current;
    if (!el) return;
    if (!enabled && !force) return;
    if (startedRef.current) return;

    startedRef.current = true;

    try {
      el.loop = true;
      el.volume = 0;
      await el.play();
      if (environmentRef.current === "exterior") {
        el.pause();
        return;
      }
      fadeTo(INTERIOR_VOLUME, 2.0);
    } catch {
      startedRef.current = false;
    }
  }, [enabled, fadeTo]);

  function toggleSound() {
    if (enabled) {
      enabledRef.current = false;
      cancelRaf();
      const el = audioRef.current;
      if (el) {
        el.pause();
      }
      setEnabled(false);
      return;
    }

    enabledRef.current = true;
    setEnabled(true);
    if (environmentRef.current === "interior") {
      const el = audioRef.current;
      if (startedRef.current && el) {
        try {
          el.play().catch(() => {});
        } catch {}
        fadeTo(INTERIOR_VOLUME, 1.2);
      } else {
        void ensureStarted(true);
      }
    }
  }

  // Start only after the first user gesture (hybrid)
  useEffect(() => {
    if (!enabled) return;

    const onFirstGesture = () => {
      if (!isInteriorRoute || environmentRef.current === "exterior") return;
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
  }, [enabled, ensureStarted, isInteriorRoute]);

  // Fade out when leaving breath zones; fade in when returning
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    environmentRef.current = isInteriorRoute ? "interior" : "exterior";

    if (!enabledRef.current) {
      cancelRaf();
      el.pause();
      return;
    }

    if (!isInteriorRoute) {
      fadeTo(0, 5.0);
      return;
    }

    if (startedRef.current) {
      try {
        el.play().catch(() => {});
      } catch {}
      fadeTo(INTERIOR_VOLUME, 2.0);
    }
  }, [cancelRaf, fadeTo, isInteriorRoute, pathname]);

  // Respond to room events (fade out/in)
  useEffect(() => {
    const handler = (e: Event) => {
      const el = audioRef.current;
      if (!el) return;

      const detail = (e as CustomEvent<AtmosphereEvent>).detail;
      if (!detail) return;

      if (detail.action === "setEnvironment") {
        environmentRef.current = detail.environment;

        if (!enabled) return;

        if (detail.environment === "exterior") {
          fadeTo(0, detail.seconds ?? 1.8);
          return;
        }

        if (!startedRef.current) {
          void ensureStarted();
          return;
        }
        try {
          el.play().catch(() => {});
        } catch {}
        fadeTo(INTERIOR_VOLUME, detail.seconds ?? 1.8);
        return;
      }

      if (!enabled) return;

      if (detail.action === "fadeOut") {
        fadeTo(0, detail.seconds ?? 5);
      }

      if (detail.action === "fadeIn") {
        if (!startedRef.current) ensureStarted();
        try {
          el.play().catch(() => {});
        } catch {}
        fadeTo(INTERIOR_VOLUME, detail.seconds ?? 2);
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
          fadeTo(INTERIOR_VOLUME, seconds);
        }, Math.max(0, silence * 1000));
      }

      if (detail.action === "stop") {
        cancelRaf();
        el.pause();
        el.currentTime = 0;
        startedRef.current = false;
      }
    };

    window.addEventListener(HOTEL_ATMOSPHERE_EVENT, handler as EventListener);
    return () =>
      window.removeEventListener(HOTEL_ATMOSPHERE_EVENT, handler as EventListener);
  }, [cancelRaf, enabled, ensureStarted, fadeTo]);

  useEffect(() => {
    return cancelRaf;
  }, [cancelRaf]);

  return (
    <>
      <audio ref={audioRef} src="/audio/breath.mp3" preload="auto" />
      <button
        type="button"
        className="atmosphere-toggle"
        onClick={toggleSound}
        onPointerDown={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
        aria-pressed={enabled}
        aria-label={enabled ? "Turn ambient sound off" : "Turn ambient sound on"}
        title={enabled ? "Turn ambient sound off" : "Turn ambient sound on"}
      >
        Sound {enabled ? "on" : "off"}
      </button>
    </>
  );
}
