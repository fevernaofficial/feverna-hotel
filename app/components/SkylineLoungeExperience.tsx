"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { ROUTES } from "../routes";
import ArchitecturalScene from "./scenes/ArchitecturalScene";
import styles from "./GrandLobbyExperience.module.css";

type SkylineView = "lounge" | "arrival";
type FocusTarget = "lounge" | "arrival";

const SKYLINE_SCENES = {
  lounge: {
    label: "The Skyline Lounge",
    src: "/images/skyline-lounge/skyline-wide-night.webp",
    alt: "The grand Skyline Lounge at night, with rainlit city windows along both sides, burgundy seating beneath Gothic and Art Deco vaults, and an illuminated bar at the far end.",
    width: 1671,
    height: 941,
  },
  arrival: {
    label: "The Skyline Lounge entrance",
    src: "/images/skyline-lounge/skyline-arrival-blue-hour-entrance.webp",
    alt: "A view back toward the Skyline Lounge entrance, with rainlit city windows on the left and the recessed, burgundy-curtained entrance to The Blue Hour on the right.",
    width: 1672,
    height: 941,
  },
} as const;

export default function SkylineLoungeExperience({
  initialView = "lounge",
}: {
  initialView?: SkylineView;
}) {
  const [view, setView] = useState<SkylineView>(initialView);
  const loungeButtonRef = useRef<HTMLButtonElement>(null);
  const arrivalButtonRef = useRef<HTMLButtonElement>(null);
  const focusTargetRef = useRef<FocusTarget | null>(null);

  const scene = SKYLINE_SCENES[view];

  useEffect(() => {
    const arrivalImage = new window.Image();
    arrivalImage.src = SKYLINE_SCENES.arrival.src;
  }, []);

  useEffect(() => {
    const focusTarget = focusTargetRef.current;
    if (!focusTarget) return;

    const frame = window.requestAnimationFrame(() => {
      const target =
        focusTarget === "lounge"
          ? loungeButtonRef.current
          : arrivalButtonRef.current;
      target?.focus();
      focusTargetRef.current = null;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [view]);

  function lookTowardEntrance() {
    focusTargetRef.current = "lounge";
    setView("arrival");
  }

  function lookTowardLounge() {
    focusTargetRef.current = "arrival";
    setView("lounge");
  }

  return (
    <main
      data-hotel-atmosphere="interior"
      className={styles.lobby}
      style={{ "--lobby-backdrop": `url('${scene.src}')` } as CSSProperties}
    >
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.shade} aria-hidden="true" />

      <header className={styles.heading}>
        <p>Hotel Feverna</p>
        <h1>Skyline Lounge</h1>
      </header>

      <div className={styles.sceneArea}>
        <ArchitecturalScene
          sceneId={`skyline-${view}`}
          sceneLabel={scene.label}
          imageSrc={scene.src}
          imageAlt={scene.alt}
          imageWidth={scene.width}
          imageHeight={scene.height}
          hotspots={
            view === "arrival"
              ? [
                  {
                    id: "blue-hour",
                    label: "The Blue Hour",
                    description: "Enter the adjoining performance room.",
                    href: ROUTES.blueHour,
                    bounds: { left: 78, top: 18, width: 15, height: 52 },
                  },
                ]
              : []
          }
          priority={view === "lounge"}
        />
      </div>

      <nav
        className={`${styles.directory} ${styles.skylineDirectory}`}
        aria-label="Skyline Lounge navigation"
      >
        {view === "lounge" ? (
          <button
            ref={arrivalButtonRef}
            type="button"
            onClick={lookTowardEntrance}
          >
            Look toward the entrance
          </button>
        ) : (
          <button
            ref={loungeButtonRef}
            type="button"
            onClick={lookTowardLounge}
          >
            Look toward the bar
          </button>
        )}
        <span aria-hidden="true" />
        {view === "arrival" ? (
          <>
            <Link href={ROUTES.blueHour}>Enter The Blue Hour</Link>
            <span aria-hidden="true" />
          </>
        ) : null}
        <Link href={ROUTES.lobby}>Return to Lobby</Link>
      </nav>
    </main>
  );
}
