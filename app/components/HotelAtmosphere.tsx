"use client";

import {
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import {
  HOTEL_ATMOSPHERE_EVENT,
  HOTEL_SOUND_STATE_EVENT,
  type AtmosphereEnvironment,
  type AtmosphereEvent,
  type HotelSoundStateEvent,
} from "../lib/atmosphere";

const INTERIOR_VOLUME = 0.18;
const AUDIO_URL = "/audio/breath.mp3";
// These points remove only the unmatched MP3 edges (about 4.5 ms from the
// start and 33.8 ms from the end). They align closely at both common Web
// Audio output rates (44.1 and 48 kHz) without changing the recording.
const LOOP_START_SECONDS = 0.0045;
const LOOP_END_SECONDS = 7.318456916099773;
const SOUND_HINT_STORAGE_KEY = "feverna.soundGuidanceDismissed.v1";
const INTERIOR_MARKER_SELECTOR = '[data-hotel-atmosphere="interior"]';

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function isTrustedUserActivation(event: Event) {
  return (
    event.isTrusted &&
    (navigator.userActivation === undefined || navigator.userActivation.isActive)
  );
}

export default function HotelAtmosphere() {
  const pathname = usePathname();

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const audioDataPromiseRef = useRef<Promise<ArrayBuffer> | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const startPromiseRef = useRef<Promise<void> | null>(null);
  const currentVolumeRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const startedRef = useRef(false);
  const userActivatedRef = useRef(false);
  const environmentRef = useRef<AtmosphereEnvironment>("interior");
  const ambienceSuppressedRef = useRef(false);
  const previousPathnameRef = useRef(pathname);
  const enabledRef = useRef(true);

  const [enabled, setEnabled] = useState(true);
  const [soundHintState, setSoundHintState] = useState<
    "pending" | "visible" | "dismissed"
  >("pending");

  const isSoundHintRoute = useMemo(
    () => pathname === "/" || pathname.startsWith("/library"),
    [pathname]
  );

  // Lobby + hallways + elevator are always breath zones.
  // Canon room routes are also breath zones until "Remain" triggers fadeOut.
  const isInteriorRoute = useMemo(() => {
    return (
      pathname === "/" ||
      pathname.startsWith("/guest") ||
      pathname.startsWith("/library") ||
      pathname.startsWith("/skyline-lounge") ||
      pathname.startsWith("/blue-hour") ||
      pathname.startsWith("/hallway") ||
      pathname.startsWith("/elevator") ||
      pathname.startsWith("/the-ache") ||
      pathname.startsWith("/next-current")
    );
  }, [pathname]);

  const isCurrentInterior = useCallback(() => {
    return (
      isInteriorRoute ||
      document.querySelector(INTERIOR_MARKER_SELECTOR) !== null
    );
  }, [isInteriorRoute]);

  useEffect(() => {
    if (!isSoundHintRoute || soundHintState !== "pending") return;

    let isDismissed = false;
    try {
      isDismissed = window.localStorage.getItem(SOUND_HINT_STORAGE_KEY) === "1";
    } catch {
      // The hint can still be dismissed for this page session without storage.
    }

    const frame = window.requestAnimationFrame(() => {
      setSoundHintState(isDismissed ? "dismissed" : "visible");
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isSoundHintRoute, soundHintState]);

  const cancelRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const loadAudioData = useCallback(() => {
    if (!audioDataPromiseRef.current) {
      audioDataPromiseRef.current = fetch(AUDIO_URL).then((response) => {
        if (!response.ok) {
          throw new Error("Hotel atmosphere audio could not be loaded.");
        }
        return response.arrayBuffer();
      }).catch((error) => {
        audioDataPromiseRef.current = null;
        throw error;
      });
    }

    return audioDataPromiseRef.current;
  }, []);

  const getAudioContext = useCallback(() => {
    let context = audioContextRef.current;
    if (context && context.state !== "closed") return context;

    context = new AudioContext();
    audioContextRef.current = context;

    const gain = context.createGain();
    gain.gain.value = 0;
    gain.connect(context.destination);
    gainRef.current = gain;
    currentVolumeRef.current = 0;

    return context;
  }, []);

  const unlockAudioContext = useCallback((context: AudioContext) => {
    // Mobile WebKit can require an AudioNode to start during the trusted
    // gesture itself. A one-frame silent source unlocks the context while the
    // real recording finishes loading and decoding asynchronously.
    const source = context.createBufferSource();
    source.buffer = context.createBuffer(1, 1, context.sampleRate);
    source.connect(context.destination);
    source.onended = () => source.disconnect();
    source.start(0);

    if (context.state !== "running") {
      return context.resume();
    }

    return Promise.resolve();
  }, []);

  const fadeTo = useCallback((target: number, seconds: number) => {
    const gain = gainRef.current;
    if (!gain) return;

    cancelRaf();

    const startVol = currentVolumeRef.current;
    const endVol = clamp01(target);
    const durationMs = Math.max(50, seconds * 1000);
    const start = performance.now();

    const tick = (now: number) => {
      const t = clamp01((now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out
      const nextVolume = startVol + (endVol - startVol) * eased;
      currentVolumeRef.current = nextVolume;
      gain.gain.value = nextVolume;

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [cancelRaf]);

  const ensureStarted = useCallback(async (force = false) => {
    // Room/environment effects can run while the page is mounting. They may
    // preload data, but must never create an AudioContext before a real user
    // interaction has satisfied the browser's autoplay policy.
    if (!userActivatedRef.current) return;
    if (!enabledRef.current && !force) return;

    if (startedRef.current) {
      const context = audioContextRef.current;
      if (context && context.state !== "running" && context.state !== "closed") {
        await context.resume().catch(() => {});
      }
      return;
    }

    if (startPromiseRef.current) {
      await startPromiseRef.current;
      return;
    }

    const startPlayback = async () => {
      const context = getAudioContext();

      // Keep context creation, resume(), and node start on the synchronous
      // side of the trusted interaction. Fetching and decoding happen later.
      await unlockAudioContext(context);

      let buffer = audioBufferRef.current;
      if (!buffer) {
        const audioData = await loadAudioData();
        buffer = await context.decodeAudioData(audioData.slice(0));
        audioBufferRef.current = buffer;
      }

      if (startedRef.current) return;

      const source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.loopStart = LOOP_START_SECONDS;
      source.loopEnd = Math.min(LOOP_END_SECONDS, buffer.duration);
      source.connect(gainRef.current!);
      source.onended = () => {
        if (sourceRef.current === source) {
          sourceRef.current = null;
          startedRef.current = false;
        }
      };
      source.start(0, LOOP_START_SECONDS);
      sourceRef.current = source;
      startedRef.current = true;

      if (
        enabledRef.current &&
        environmentRef.current === "interior" &&
        !ambienceSuppressedRef.current
      ) {
        fadeTo(INTERIOR_VOLUME, 2.0);
      }
    };

    const startPromise = startPlayback();
    startPromiseRef.current = startPromise;

    try {
      await startPromise;
    } catch {
      startedRef.current = false;
    } finally {
      if (startPromiseRef.current === startPromise) {
        startPromiseRef.current = null;
      }
    }
  }, [fadeTo, getAudioContext, loadAudioData, unlockAudioContext]);

  function toggleSound(event: ReactMouseEvent<HTMLButtonElement>) {
    if (enabled) {
      enabledRef.current = false;
      cancelRaf();
      currentVolumeRef.current = 0;
      if (gainRef.current) {
        gainRef.current.gain.value = 0;
      }
      setEnabled(false);
      return;
    }

    enabledRef.current = true;
    userActivatedRef.current = isTrustedUserActivation(event.nativeEvent);
    setEnabled(true);
    if (
      environmentRef.current === "interior" &&
      !ambienceSuppressedRef.current
    ) {
      if (startedRef.current) {
        audioContextRef.current?.resume().catch(() => {});
        fadeTo(INTERIOR_VOLUME, 1.2);
      } else {
        void ensureStarted(true);
      }
    }
  }

  function dismissSoundHint() {
    setSoundHintState("dismissed");
    try {
      window.localStorage.setItem(SOUND_HINT_STORAGE_KEY, "1");
    } catch {
      // Keep the in-memory dismissal when storage is unavailable.
    }
  }

  // Start only after the first user gesture. Capture-phase listeners ensure
  // the sound and hint controls can also unlock mobile audio even though they
  // intentionally stop bubbling to the architectural scene.
  useEffect(() => {
    if (!enabled) return;

    const removeGestureListeners = () => {
      window.removeEventListener("click", onFirstGesture, true);
      window.removeEventListener("keydown", onFirstGesture, true);
    };

    const onFirstGesture = (event: Event) => {
      if (!isTrustedUserActivation(event)) return;
      if (!isCurrentInterior() || environmentRef.current === "exterior") return;
      userActivatedRef.current = true;
      void ensureStarted().then(() => {
        if (startedRef.current) removeGestureListeners();
      });
    };

    window.addEventListener("click", onFirstGesture, true);
    window.addEventListener("keydown", onFirstGesture, true);

    return removeGestureListeners;
  }, [enabled, ensureStarted, isCurrentInterior]);

  // iOS Safari exposes an "interrupted" context state after tab, app, or
  // screen changes. Resume the existing graph when the page becomes visible;
  // never create a second source or override the visitor's mute preference.
  useEffect(() => {
    const resumeVisibleInterior = () => {
      if (
        document.visibilityState !== "visible" ||
        !enabledRef.current ||
        !startedRef.current ||
        environmentRef.current !== "interior" ||
        ambienceSuppressedRef.current
      ) {
        return;
      }

      const context = audioContextRef.current;
      if (!context || context.state === "running" || context.state === "closed") {
        return;
      }

      void context.resume().then(() => {
        if (
          enabledRef.current &&
          startedRef.current &&
          environmentRef.current === "interior" &&
          !ambienceSuppressedRef.current
        ) {
          fadeTo(INTERIOR_VOLUME, 0.8);
        }
      }).catch(() => {});
    };

    document.addEventListener("visibilitychange", resumeVisibleInterior);
    window.addEventListener("pageshow", resumeVisibleInterior);

    return () => {
      document.removeEventListener("visibilitychange", resumeVisibleInterior);
      window.removeEventListener("pageshow", resumeVisibleInterior);
    };
  }, [fadeTo]);

  // Fade out when leaving breath zones; fade in when returning
  useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      ambienceSuppressedRef.current = false;
      previousPathnameRef.current = pathname;
    }

    const isInteriorEnvironment = isCurrentInterior();
    environmentRef.current = isInteriorEnvironment ? "interior" : "exterior";

    if (!enabledRef.current) {
      cancelRaf();
      currentVolumeRef.current = 0;
      if (gainRef.current) {
        gainRef.current.gain.value = 0;
      }
      return;
    }

    if (!isInteriorEnvironment || ambienceSuppressedRef.current) {
      fadeTo(0, 5.0);
      return;
    }

    if (startedRef.current) {
      audioContextRef.current?.resume().catch(() => {});
      fadeTo(INTERIOR_VOLUME, 2.0);
    }
  }, [cancelRaf, fadeTo, isCurrentInterior, pathname]);

  // Respond to room events (fade out/in)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<AtmosphereEvent>).detail;
      if (!detail) return;

      if (detail.action === "setEnvironment") {
        environmentRef.current = detail.environment;

        if (!enabled) return;

        if (detail.environment === "exterior") {
          fadeTo(0, detail.seconds ?? 1.8);
          return;
        }


        if (ambienceSuppressedRef.current) {
          fadeTo(0, detail.seconds ?? 1.8);
          return;
        }

        if (!startedRef.current) {
          void ensureStarted();
          return;
        }
        audioContextRef.current?.resume().catch(() => {});
        fadeTo(INTERIOR_VOLUME, detail.seconds ?? 1.8);
        return;
      }

      if (detail.action === "suppress") {
        ambienceSuppressedRef.current = true;
        fadeTo(0, detail.seconds ?? 1.2);
        return;
      }

      if (detail.action === "release") {
        ambienceSuppressedRef.current = false;
        if (
          enabledRef.current &&
          environmentRef.current === "interior"
        ) {
          if (!startedRef.current) {
            void ensureStarted();
          } else {
            audioContextRef.current?.resume().catch(() => {});
          }
          fadeTo(INTERIOR_VOLUME, detail.seconds ?? 1.8);
        }
        return;
      }

      if (!enabled) return;

      if (detail.action === "fadeOut") {
        fadeTo(0, detail.seconds ?? 5);
      }

      if (detail.action === "fadeIn") {
        if (!startedRef.current) {
          void ensureStarted();
        } else {
          audioContextRef.current?.resume().catch(() => {});
        }
        fadeTo(INTERIOR_VOLUME, detail.seconds ?? 2);
      }

      if (detail.action === "fadeInAfterSilence") {
        const silence = detail.silenceSeconds ?? 1.5;
        const seconds = detail.seconds ?? 2;
        fadeTo(0, 0.3);
        window.setTimeout(() => {
          if (!startedRef.current) {
            void ensureStarted();
          } else {
            audioContextRef.current?.resume().catch(() => {});
          }
          fadeTo(INTERIOR_VOLUME, seconds);
        }, Math.max(0, silence * 1000));
      }

      if (detail.action === "stop") {
        cancelRaf();
        sourceRef.current?.stop();
        sourceRef.current?.disconnect();
        sourceRef.current = null;
        currentVolumeRef.current = 0;
        if (gainRef.current) {
          gainRef.current.gain.value = 0;
        }
        startedRef.current = false;
      }
    };

    window.addEventListener(HOTEL_ATMOSPHERE_EVENT, handler as EventListener);
    return () =>
      window.removeEventListener(HOTEL_ATMOSPHERE_EVENT, handler as EventListener);
  }, [cancelRaf, enabled, ensureStarted, fadeTo]);

  // Publish the global sound preference so room-specific players can obey
  // the same accessible Sound on/off control without owning another toggle.
  useEffect(() => {
    document.documentElement.dataset.fevernaSound = enabled ? "on" : "off";
    window.dispatchEvent(
      new CustomEvent<HotelSoundStateEvent>(HOTEL_SOUND_STATE_EVENT, {
        detail: { enabled },
      })
    );
  }, [enabled]);

  useEffect(() => {
    void loadAudioData().catch(() => {});

    return () => {
      cancelRaf();
      sourceRef.current?.stop();
      sourceRef.current?.disconnect();
      sourceRef.current = null;
      gainRef.current?.disconnect();
      gainRef.current = null;
      startedRef.current = false;

      const context = audioContextRef.current;
      audioContextRef.current = null;
      void context?.close();
    };
  }, [cancelRaf, loadAudioData]);

  return (
    <>
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
      {isSoundHintRoute && soundHintState === "visible" ? (
        <aside
          className="atmosphere-hint fade-in-quick"
          style={{ pointerEvents: "none" }}
          aria-labelledby="sound-recommendation-title"
          aria-describedby="sound-recommendation-description"
        >
          <div>
            <p
              id="sound-recommendation-title"
              className="atmosphere-hint-title"
            >
              Sound recommended
            </p>
            <p
              id="sound-recommendation-description"
              className="atmosphere-hint-description"
            >
              For the fullest experience, enable sound here and on your device.
            </p>
          </div>
          <button
            type="button"
            className="atmosphere-hint-dismiss"
            style={{ pointerEvents: "auto" }}
            onClick={dismissSoundHint}
            onPointerDown={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
            aria-label="Dismiss sound recommendation"
          >
            Dismiss
          </button>
        </aside>
      ) : null}
    </>
  );
}
