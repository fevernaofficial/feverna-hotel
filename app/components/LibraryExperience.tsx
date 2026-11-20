"use client";

import Link from "next/link";
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { ROUTES } from "../routes";
import ReturnedBookDiscovery from "./library/ReturnedBookDiscovery";
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
  const [returnedBookOpen, setReturnedBookOpen] = useState(false);
  const seatButtonRef = useRef<HTMLButtonElement>(null);
  const standButtonRef = useRef<HTMLButtonElement>(null);
  const focusTargetRef = useRef<FocusTarget | null>(null);
  const discoveryTriggerRef = useRef<HTMLButtonElement | null>(null);
  const discoveryWasOpenRef = useRef(false);

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

  useEffect(() => {
    if (returnedBookOpen) {
      discoveryWasOpenRef.current = true;
      return;
    }

    if (!discoveryWasOpenRef.current) return;

    const frame = window.requestAnimationFrame(() => {
      discoveryTriggerRef.current?.focus({ preventScroll: true });
      discoveryWasOpenRef.current = false;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [returnedBookOpen]);

  function takeASeat() {
    focusTargetRef.current = "stand";
    setView("seated");
  }

  function standUp() {
    focusTargetRef.current = "seat";
    setView("room");
  }

  function examineReturnedBook(event: ReactMouseEvent<HTMLButtonElement>) {
    discoveryTriggerRef.current = event.currentTarget;
    setReturnedBookOpen(true);
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
          {
            id: "returned-book",
            label: "Examine the Returned Book",
            description:
              "A worn volume rests among the books on the foreground table.",
            bounds: { left: 70, top: 62.5, width: 13, height: 12 },
            controls: "returned-book-discovery",
            expanded: returnedBookOpen,
            onActivate: examineReturnedBook,
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

      <header
        className={styles.heading}
        aria-hidden={returnedBookOpen || undefined}
        inert={returnedBookOpen || undefined}
      >
        <p>Hotel Feverna</p>
        <h1>Library</h1>
      </header>

      <div
        className={styles.sceneArea}
        aria-hidden={returnedBookOpen || undefined}
        inert={returnedBookOpen || undefined}
      >
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
        aria-hidden={returnedBookOpen || undefined}
        inert={returnedBookOpen || undefined}
      >
        {view === "room" ? (
          <>
            <button
              type="button"
              onClick={examineReturnedBook}
              aria-controls="returned-book-discovery"
              aria-expanded={returnedBookOpen}
            >
              Examine Returned Book
            </button>
            <span aria-hidden="true" />
            <button ref={seatButtonRef} type="button" onClick={takeASeat}>
              Take a Seat
            </button>
          </>
        ) : (
          <button ref={standButtonRef} type="button" onClick={standUp}>
            Stand Up
          </button>
        )}
        <span aria-hidden="true" />
        <Link href={ROUTES.lobby}>Return to Lobby</Link>
      </nav>

      <ReturnedBookDiscovery
        open={returnedBookOpen}
        onDismiss={() => setReturnedBookOpen(false)}
      />
    </main>
  );
}
