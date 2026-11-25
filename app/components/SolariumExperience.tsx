"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { ROUTES } from "../routes";
import styles from "./GrandLobbyExperience.module.css";
import ArchitecturalScene, { type SceneHotspot } from "./scenes/ArchitecturalScene";

const SCENES = {
  main: {
    label: "Main Solarium",
    file: "solarium-main.webp",
    alt: "A stone fountain in a sunlit room with pale green vaults, wicker seating, and tall windows looking out to the sea.",
  },
  sofa: {
    label: "Sofa Seating",
    file: "solarium-sofa.webp",
    alt: "A view across the fountain from the wicker sofa, with palms, flowers, and the sea-facing doors beyond.",
  },
  gallery: {
    label: "Window Gallery",
    file: "solarium-window-gallery.webp",
    alt: "A row of arched windows along the left looks out over the coastline, with the fountain on the right.",
  },
  threshold: {
    label: "Look Back into the Solarium",
    file: "solarium-look-back.webp",
    alt: "Looking inward from the sea-facing doorway, with the central fountain beneath the chandelier and the interior entrance beyond.",
  },
} as const;

type View = keyof typeof SCENES;

const ACTIONS = {
  seat: { label: "Take a Seat", view: "sofa" },
  windows: { label: "Approach the Windows", view: "gallery" },
  lookBack: { label: "Look Back into the Solarium", view: "threshold" },
  returnGallery: { label: "Return to Window Gallery", view: "gallery" },
  returnMain: { label: "Return to Main Solarium", view: "main" },
} as const satisfies Record<string, { label: string; view: View }>;

type Action = keyof typeof ACTIONS;

const VIEW_ACTIONS = {
  main: ["seat", "windows"],
  sofa: ["windows", "returnMain"],
  gallery: ["lookBack", "returnMain"],
  threshold: ["returnGallery", "returnMain"],
} as const satisfies Record<View, readonly Action[]>;

export default function SolariumExperience() {
  const [view, setView] = useState<View>("main");
  const directoryRef = useRef<HTMLElement>(null);
  const focusTargetRef = useRef<Action | null>(null);
  const scene = SCENES[view];
  const imageSrc = `/images/solarium/${scene.file}`;

  useEffect(() => {
    const target = focusTargetRef.current;
    if (!target) return;

    const frame = window.requestAnimationFrame(() => {
      directoryRef.current
        ?.querySelector<HTMLButtonElement>(`[data-solarium-action="${target}"]`)
        ?.focus({ preventScroll: true });
      focusTargetRef.current = null;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [view]);

  function changeView(action: Action) {
    const nextView = ACTIONS[action].view;

    if (nextView === "main") {
      focusTargetRef.current = view === "sofa" ? "seat" : "windows";
    } else {
      focusTargetRef.current =
        nextView === "sofa" ? "returnMain" : VIEW_ACTIONS[nextView][0];
    }

    setView(nextView);
  }

  const hotspots: SceneHotspot[] =
    view === "main"
      ? [
          {
            id: "window-side-sofa",
            label: ACTIONS.seat.label,
            narrowLabelAlign: "end",
            bounds: { left: 76, top: 52, width: 14, height: 15 },
            onActivate: () => changeView("seat"),
          },
          {
            id: "sea-facing-window",
            label: ACTIONS.windows.label,
            narrowLabelAlign: "start",
            bounds: { left: 16.8, top: 24, width: 12, height: 23 },
            onActivate: () => changeView("windows"),
          },
        ]
      : [];

  return (
    <main
      data-hotel-atmosphere="interior"
      className={styles.lobby}
      style={{ "--lobby-backdrop": `url('${imageSrc}')` } as CSSProperties}
    >
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.shade} aria-hidden="true" />

      <header className={styles.heading}>
        <p>Hotel Feverna</p>
        <h1>Solarium</h1>
      </header>

      <div className={`${styles.sceneArea} ${styles.solariumSceneArea}`}>
        <ArchitecturalScene
          sceneId={`solarium-${view}`}
          sceneLabel={scene.label}
          imageSrc={imageSrc}
          imageAlt={scene.alt}
          imageWidth={1672}
          imageHeight={941}
          hotspots={hotspots}
          priority={view === "main"}
        />
      </div>

      <nav
        ref={directoryRef}
        className={`${styles.directory} ${styles.solariumDirectory}`}
        aria-label="Solarium navigation"
      >
        {VIEW_ACTIONS[view].map((action, index) => (
          <Fragment key={action}>
            {index > 0 ? <span aria-hidden="true" /> : null}
            <button
              type="button"
              data-solarium-action={action}
              onClick={() => changeView(action)}
            >
              {ACTIONS[action].label}
            </button>
          </Fragment>
        ))}
        {view === "main" ? (
          <>
            <span aria-hidden="true" />
            <Link href={ROUTES.lobby}>Return to Lobby</Link>
          </>
        ) : null}
      </nav>
    </main>
  );
}
