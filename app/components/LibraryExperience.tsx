"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { ROUTES } from "../routes";
import ArchitecturalScene, {
  type SceneHotspot,
} from "./scenes/ArchitecturalScene";
import styles from "./GrandLobbyExperience.module.css";

type LibraryView = "room" | "seated";
type FocusTarget = "seat" | "stand";

const LIBRARY_SCENES = {
  room: {
    label: "The Library",
    src: "/images/Rainy-Hotel-Library.webp",
    alt: "The library of Hotel Feverna, with bookshelves, a lit fireplace, reading chairs, a long study table, and rain against tall Gothic windows.",
    width: 1672,
    height: 941,
  },
  seated: {
    label: "Seated in the Library",
    src: "/images/Feverna-Library-seated.webp",
    alt: "A seated view from the Library's rear window alcove, overlooking a writing desk, rain-streaked Gothic windows, and the firelit room.",
    width: 1672,
    height: 941,
  },
} as const;

export default function LibraryExperience() {
  const [view, setView] = useState<LibraryView>("room");
  const seatButtonRef = useRef<HTMLButtonElement>(null);
  const standButtonRef = useRef<HTMLButtonElement>(null);
  const focusTargetRef = useRef<FocusTarget | null>(null);

  const scene = LIBRARY_SCENES[view];

  useEffect(() => {
    const focusTarget = focusTargetRef.current;
    if (!focusTarget) return;

    const frame = window.requestAnimationFrame(() => {
      const target =
        focusTarget === "stand"
          ? standButtonRef.current
          : seatButtonRef.current;
      target?.focus();
      focusTargetRef.current = null;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [view]);

  function takeASeat() {
    focusTargetRef.current = "stand";
    setView("seated");
  }

  function standUp() {
    focusTargetRef.current = "seat";
    setView("room");
  }

  const hotspots: SceneHotspot[] =
    view === "room"
      ? [
          {
            id: "window-alcove-chair",
            label: "Take a Seat",
            description: "Settle into the green chair by the rear window.",
            bounds: { left: 70.5, top: 38, width: 13, height: 24 },
            onActivate: takeASeat,
          },
        ]
      : [];

  return (
    <main
      className={styles.lobby}
      style={{ "--lobby-backdrop": `url('${scene.src}')` } as CSSProperties}
    >
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.shade} aria-hidden="true" />

      <header className={styles.heading}>
        <p>Hotel Feverna</p>
        <h1>Library</h1>
      </header>

      <div className={styles.sceneArea}>
        <ArchitecturalScene
          sceneId={`library-${view}`}
          sceneLabel={scene.label}
          imageSrc={scene.src}
          imageAlt={scene.alt}
          imageWidth={scene.width}
          imageHeight={scene.height}
          hotspots={hotspots}
          priority={view === "room"}
        />
      </div>

      <nav
        className={`${styles.directory} ${
          view === "seated" ? styles.subduedDirectory : ""
        }`}
        aria-label="Library navigation"
      >
        {view === "room" ? (
          <button ref={seatButtonRef} type="button" onClick={takeASeat}>
            Take a Seat
          </button>
        ) : (
          <button ref={standButtonRef} type="button" onClick={standUp}>
            Stand Up
          </button>
        )}
        <span aria-hidden="true" />
        <Link href={ROUTES.lobby}>Return to Lobby</Link>
      </nav>
    </main>
  );
}
