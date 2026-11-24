"use client";

import type { Route } from "next";
import Link from "next/link";
import type { ChangeEvent, CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  HOTEL_SOUND_STATE_EVENT,
  type HotelSoundStateEvent,
  releaseHotelAtmosphere,
  suppressHotelAtmosphere,
} from "../lib/atmosphere";
import { ROUTES, routeWithQuery } from "../routes";
import lobbyStyles from "./GrandLobbyExperience.module.css";
import styles from "./BlueHourExperience.module.css";
import ArchitecturalScene from "./scenes/ArchitecturalScene";

const TRACKS = [
  {
    title: "Still Awake",
    src: "/audio/blue-hour/still-awake-lounge.mp3",
  },
  {
    title: "The Spark",
    src: "/audio/blue-hour/the-spark-lounge.mp3",
  },
  {
    title: "Beneath Her Tide",
    src: "/audio/blue-hour/beneath-her-tide-lounge.mp3",
  },
] as const;

type PlaybackStatus =
  | "idle"
  | "loading"
  | "playing"
  | "paused"
  | "ended"
  | "error";
type PlayMode = "selected" | "all" | null;

const QUIET_IMAGE = "/images/blue-hour/blue-hour-quiet-interlude.webp";
const PERFORMANCE_IMAGE = "/images/blue-hour/blue-hour-performance.webp";

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

export default function BlueHourExperience() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeFrameRef = useRef<number | null>(null);
  const operationRef = useRef(0);
  const playModeRef = useRef<PlayMode>(null);
  const currentTrackRef = useRef(0);
  const localVolumeRef = useRef(0.72);
  const masterEnabledRef = useRef(true);

  const [selectedTrack, setSelectedTrack] = useState(0);
  const [status, setStatus] = useState<PlaybackStatus>("idle");
  const [statusMessage, setStatusMessage] = useState(
    "Quiet interlude. Choose a recording when you are ready."
  );
  const [performanceVisible, setPerformanceVisible] = useState(false);
  const [localVolume, setLocalVolume] = useState(0.72);
  const [masterEnabled, setMasterEnabled] = useState(true);

  const cancelFade = useCallback(() => {
    if (fadeFrameRef.current !== null) {
      cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }
  }, []);

  const fadeMusic = useCallback(
    (target: number, durationMs: number, operation: number) => {
      const audio = audioRef.current;
      if (!audio) return Promise.resolve(false);

      cancelFade();
      const startVolume = audio.volume;
      const endVolume = clamp01(target);
      const startedAt = performance.now();

      return new Promise<boolean>((resolve) => {
        const tick = (now: number) => {
          if (operationRef.current !== operation) {
            fadeFrameRef.current = null;
            resolve(false);
            return;
          }

          const progress = clamp01((now - startedAt) / durationMs);
          const eased = 1 - Math.pow(1 - progress, 3);
          audio.volume =
            startVolume + (endVolume - startVolume) * eased;

          if (progress < 1) {
            fadeFrameRef.current = requestAnimationFrame(tick);
          } else {
            fadeFrameRef.current = null;
            resolve(true);
          }
        };

        fadeFrameRef.current = requestAnimationFrame(tick);
      });
    },
    [cancelFade]
  );

  const startTrack = useCallback(
    async (trackIndex: number, mode: Exclude<PlayMode, null>, operation?: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      const activeOperation = operation ?? ++operationRef.current;
      cancelFade();
      playModeRef.current = mode;
      currentTrackRef.current = trackIndex;
      setStatus("loading");
      setStatusMessage(`Preparing ${TRACKS[trackIndex].title}.`);

      audio.pause();
      audio.volume = 0;
      audio.muted = !masterEnabledRef.current;
      audio.src = TRACKS[trackIndex].src;
      audio.load();
      suppressHotelAtmosphere(0.9);

      try {
        await audio.play();
        if (operationRef.current !== activeOperation) return;

        setPerformanceVisible(true);
        setStatus("playing");
        setStatusMessage(`Now playing ${TRACKS[trackIndex].title}.`);
        await fadeMusic(localVolumeRef.current, 900, activeOperation);
      } catch {
        if (operationRef.current !== activeOperation) return;
        playModeRef.current = null;
        setStatus("error");
        setStatusMessage(
          "The recording could not begin. Please try the play control again."
        );
        setPerformanceVisible(false);
        releaseHotelAtmosphere(1.2);
      }
    },
    [cancelFade, fadeMusic]
  );

  const switchTrack = useCallback(
    async (trackIndex: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      const operation = ++operationRef.current;
      const mode = playModeRef.current ?? "selected";
      const faded = await fadeMusic(0, 260, operation);
      if (!faded || operationRef.current !== operation) return;
      await startTrack(trackIndex, mode, operation);
    },
    [fadeMusic, startTrack]
  );

  function playSelected() {
    void startTrack(selectedTrack, "selected");
  }

  function playAll() {
    setSelectedTrack(0);
    void startTrack(0, "all");
  }

  function pauseOrResume() {
    const audio = audioRef.current;
    if (!audio) return;

    if (status === "playing") {
      ++operationRef.current;
      cancelFade();
      audio.pause();
      setStatus("paused");
      setStatusMessage(`Paused ${TRACKS[currentTrackRef.current].title}.`);
      return;
    }

    if (status !== "paused") return;

    const operation = ++operationRef.current;
    audio.muted = !masterEnabledRef.current;
    suppressHotelAtmosphere(0.5);
    void audio
      .play()
      .then(() => {
        if (operationRef.current !== operation) return;
        setStatus("playing");
        setStatusMessage(`Now playing ${TRACKS[currentTrackRef.current].title}.`);
        return fadeMusic(localVolumeRef.current, 350, operation);
      })
      .catch(() => {
        if (operationRef.current !== operation) return;
        setStatus("error");
        setStatusMessage(
          "The recording could not resume. Please try the play control again."
        );
      });
  }

  function stopPlayback() {
    const audio = audioRef.current;
    if (!audio) return;

    const operation = ++operationRef.current;
    playModeRef.current = null;
    setStatusMessage("Returning to the quiet interlude.");

    void fadeMusic(0, 650, operation).then((completed) => {
      if (!completed || operationRef.current !== operation) return;
      audio.pause();
      audio.currentTime = 0;
      audio.volume = localVolumeRef.current;
      setStatus("idle");
      setPerformanceVisible(false);
      setStatusMessage(
        "Quiet interlude. Choose a recording when you are ready."
      );
      releaseHotelAtmosphere(1.8);
    });
  }

  function selectTrack(event: ChangeEvent<HTMLInputElement>) {
    const trackIndex = Number(event.target.value);
    setSelectedTrack(trackIndex);

    if (status === "playing" || status === "loading") {
      void switchTrack(trackIndex);
      return;
    }

    const audio = audioRef.current;
    if (audio && performanceVisible) {
      ++operationRef.current;
      cancelFade();
      audio.pause();
      audio.src = TRACKS[trackIndex].src;
      audio.load();
      audio.volume = localVolumeRef.current;
      currentTrackRef.current = trackIndex;
      setStatus("paused");
      setStatusMessage(`${TRACKS[trackIndex].title} selected and ready.`);
    } else {
      setStatusMessage(`${TRACKS[trackIndex].title} selected.`);
    }
  }

  function changeVolume(event: ChangeEvent<HTMLInputElement>) {
    const nextVolume = Number(event.target.value);
    localVolumeRef.current = nextVolume;
    setLocalVolume(nextVolume);
    if (audioRef.current) audioRef.current.volume = nextVolume;
  }

  const handleEnded = useCallback(() => {
    const finishedTrack = currentTrackRef.current;
    const completedMode = playModeRef.current;

    if (completedMode === "all" && finishedTrack < TRACKS.length - 1) {
      const nextTrack = finishedTrack + 1;
      setSelectedTrack(nextTrack);
      void startTrack(nextTrack, "all");
      return;
    }

    playModeRef.current = null;
    setStatus("ended");
    setStatusMessage(
      completedMode === "all"
        ? "The Blue Hour program is complete."
        : `${TRACKS[finishedTrack].title} has ended.`
    );
  }, [startTrack]);

  const handleAudioError = useCallback(() => {
    if (!audioRef.current?.getAttribute("src")) return;
    ++operationRef.current;
    cancelFade();
    playModeRef.current = null;
    setStatus("error");
    setStatusMessage(
      "The recording became unavailable. Please choose a recording and try again."
    );
    setPerformanceVisible(false);
    releaseHotelAtmosphere(1.2);
  }, [cancelFade]);

  useEffect(() => {
    const initialEnabled =
      document.documentElement.dataset.fevernaSound !== "off";
    masterEnabledRef.current = initialEnabled;
    if (audioRef.current) audioRef.current.muted = !initialEnabled;
    const frame = window.requestAnimationFrame(() => {
      setMasterEnabled(initialEnabled);
    });

    const handleSoundState = (event: Event) => {
      const { enabled } = (event as CustomEvent<HotelSoundStateEvent>).detail;
      masterEnabledRef.current = enabled;
      setMasterEnabled(enabled);
      if (audioRef.current) audioRef.current.muted = !enabled;
    };

    window.addEventListener(
      HOTEL_SOUND_STATE_EVENT,
      handleSoundState as EventListener
    );
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener(
        HOTEL_SOUND_STATE_EVENT,
        handleSoundState as EventListener
      );
    };
  }, []);

  useEffect(() => {
    const operation = operationRef;
    const audio = audioRef.current;

    return () => {
      ++operation.current;
      cancelFade();
      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }
    };
  }, [cancelFade]);

  const imageAlt = performanceVisible
    ? "The Blue Hour during a smoky evening performance, with a singer at center stage, accompanying musicians, an attentive audience, and the bar in service."
    : "The Blue Hour during a quiet interlude, its empty tables facing an upright piano, bass, and compact drum kit beneath low amber lights.";

  return (
    <main
      data-hotel-atmosphere="interior"
      className={lobbyStyles.lobby}
      style={{ "--lobby-backdrop": `url('${QUIET_IMAGE}')` } as CSSProperties}
    >
      <div className={lobbyStyles.backdrop} aria-hidden="true" />
      <div className={lobbyStyles.shade} aria-hidden="true" />

      <header className={lobbyStyles.heading}>
        <p>Skyline Lounge</p>
        <h1>The Blue Hour</h1>
      </header>

      <div className={`${lobbyStyles.sceneArea} ${styles.sceneArea}`}>
        <ArchitecturalScene
          sceneId="blue-hour"
          sceneLabel="The Blue Hour"
          imageSrc={QUIET_IMAGE}
          imageAlt={imageAlt}
          imageWidth={1672}
          imageHeight={941}
          alternateImageSrc={PERFORMANCE_IMAGE}
          alternateImageVisible={performanceVisible}
          hotspots={[]}
          priority
        />

        <section className={styles.player} aria-labelledby="blue-hour-player-title">
          <div className={styles.playerHeading}>
            <div>
              <p className={styles.eyebrow}>Evening recordings</p>
              <h2 id="blue-hour-player-title">At The Blue Hour</h2>
            </div>
            <span className={styles.soundState}>
              Master sound {masterEnabled ? "on" : "off"}
            </span>
          </div>

          <fieldset className={styles.trackList}>
            <legend>Select a recording</legend>
            {TRACKS.map((track, index) => (
              <label key={track.src}>
                <input
                  type="radio"
                  name="blue-hour-track"
                  value={index}
                  checked={selectedTrack === index}
                  onChange={selectTrack}
                />
                <span>{track.title}</span>
              </label>
            ))}
          </fieldset>

          <div className={styles.actions} aria-label="Playback controls">
            <button type="button" onClick={playSelected}>
              Play Selected
            </button>
            <button type="button" onClick={playAll}>
              Play All
            </button>
            <button
              type="button"
              onClick={pauseOrResume}
              disabled={status !== "playing" && status !== "paused"}
            >
              {status === "paused" ? "Resume" : "Pause"}
            </button>
            <button
              type="button"
              onClick={stopPlayback}
              disabled={status === "idle" && !performanceVisible}
            >
              Stop
            </button>
          </div>

          <div className={styles.volumeRow}>
            <label htmlFor="blue-hour-volume">Music volume</label>
            <input
              id="blue-hour-volume"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={localVolume}
              onChange={changeVolume}
            />
          </div>

          <p
            className={status === "error" ? styles.error : styles.status}
            role={status === "error" ? "alert" : undefined}
            aria-live={status === "error" ? "assertive" : "polite"}
          >
            {statusMessage}
          </p>

          <audio
            ref={audioRef}
            preload="metadata"
            onEnded={handleEnded}
            onError={handleAudioError}
            aria-hidden="true"
          />
        </section>
      </div>

      <nav className={lobbyStyles.directory} aria-label="The Blue Hour navigation">
        <Link
          href={routeWithQuery(ROUTES.skylineLounge, {
            view: "arrival",
          }) as Route}
        >
          Return to Skyline Lounge
        </Link>
      </nav>
    </main>
  );
}
