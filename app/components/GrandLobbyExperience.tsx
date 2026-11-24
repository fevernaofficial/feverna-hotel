"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ROUTES } from "../routes";
import { setAtmosphereEnvironment } from "../lib/atmosphere";
import ArchitecturalScene, {
  type SceneHotspot,
} from "./scenes/ArchitecturalScene";
import styles from "./GrandLobbyExperience.module.css";

type LobbyView = "lobby" | "exterior";

const CARETAKER_WELCOME = {
  title: "A Note from the Caretaker",
  paragraphs: [
    "Welcome to Hotel Feverna.",
    "The Library is open, should you care for a quiet place to sit. You're also welcome to leave a few words in the Visitor's Book here at the desk.",
    "Please make yourself comfortable. There is no need to hurry.",
  ],
  signature: "— The Caretaker",
} as const;

const SCENES = {
  lobby: {
    label: "The Grand Lobby",
    src: "/images/Hotel-Feverna-Grand-Lobby.webp",
    alt: "The Grand Lobby of Hotel Feverna, with a reception desk beneath twin staircases, a gift shop to the left, and a library to the right.",
    width: 1671,
    height: 941,
  },
  exterior: {
    label: "Outside Hotel Feverna",
    src: "/images/Hotel-Feverna-exterior.webp",
    alt: "The illuminated Gothic and Art Deco entrance of Hotel Feverna on a rainy night.",
    width: 1672,
    height: 941,
  },
} as const;

export default function GrandLobbyExperience() {
  const [view, setView] = useState<LobbyView>("lobby");
  const [receptionOpen, setReceptionOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const scene = SCENES[view];

  const closeReception = useCallback(() => {
    setReceptionOpen(false);
    window.requestAnimationFrame(() => previousFocusRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!receptionOpen) return;

    closeButtonRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeReception();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [closeReception, receptionOpen]);

  function openReception() {
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setReceptionOpen(true);
  }

  function showView(nextView: LobbyView) {
    setReceptionOpen(false);
    setAtmosphereEnvironment(
      nextView === "lobby" ? "interior" : "exterior"
    );
    setView(nextView);
  }

  const hotspots: SceneHotspot[] =
    view === "lobby"
      ? [
          {
            id: "reception",
            label: "Reception",
            description: "Approach the front desk.",
            bounds: { left: 33, top: 54, width: 34, height: 25 },
            onActivate: openReception,
            controls: "reception-welcome",
            expanded: receptionOpen,
          },
          {
            id: "library",
            label: "Library",
            description: "Enter through the library doorway.",
            bounds: { left: 84, top: 27, width: 14, height: 43 },
            href: ROUTES.library,
          },
        ]
      : [
          {
            id: "hotel-entrance",
            label: "Return to Lobby",
            description: "Enter through the front doors.",
            bounds: { left: 36, top: 48, width: 28, height: 43 },
            onActivate: () => showView("lobby"),
          },
        ];

  return (
    <main
      className={styles.lobby}
      style={{ "--lobby-backdrop": `url('${scene.src}')` } as CSSProperties}
    >
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.shade} aria-hidden="true" />

      <header className={styles.heading}>
        <p>Hotel Feverna</p>
        <h1>{view === "lobby" ? "Grand Lobby" : "Outside the Hotel"}</h1>
      </header>

      <div className={styles.sceneArea}>
        <ArchitecturalScene
          sceneId={view}
          sceneLabel={scene.label}
          imageSrc={scene.src}
          imageAlt={scene.alt}
          imageWidth={scene.width}
          imageHeight={scene.height}
          hotspots={hotspots}
          priority={view === "lobby"}
        />

        {receptionOpen ? (
          <section
            id="reception-welcome"
            className={styles.receptionPanel}
            role="dialog"
            aria-modal="false"
            aria-labelledby="reception-title"
          >
            <button
              ref={closeButtonRef}
              type="button"
              className={styles.closeButton}
              onClick={closeReception}
              aria-label="Close reception welcome"
            >
              Close
            </button>

            <p className={styles.eyebrow}>Reception</p>
            <h2 id="reception-title">{CARETAKER_WELCOME.title}</h2>
            <div className={styles.receptionMessage}>
              {CARETAKER_WELCOME.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p className={styles.signature}>{CARETAKER_WELCOME.signature}</p>
            </div>
            <Link className={styles.primaryLink} href={ROUTES.guest}>
              Open the Visitor&apos;s Book
            </Link>
          </section>
        ) : null}
      </div>

      <nav
        className={`${styles.directory} ${
          view === "lobby" ? styles.lobbyDirectory : ""
        }`}
        aria-label="Grand Lobby navigation"
      >
        {view === "lobby" ? (
          <>
            <button
              type="button"
              onClick={openReception}
              aria-controls="reception-welcome"
              aria-expanded={receptionOpen}
            >
              Approach Reception
            </button>
            <span aria-hidden="true" />
            <Link href={ROUTES.library}>Enter Library</Link>
            <span aria-hidden="true" />
            <Link href={ROUTES.skylineLounge}>Skyline Lounge</Link>
            <span aria-hidden="true" />
            <button type="button" onClick={() => showView("exterior")}>
              Step Outside
            </button>
          </>
        ) : (
          <button type="button" onClick={() => showView("lobby")}>
            Return to Lobby
          </button>
        )}
      </nav>
    </main>
  );
}
