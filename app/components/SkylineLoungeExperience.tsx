"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { Fragment, useEffect, useRef, useState } from "react";
import { ROUTES } from "../routes";
import ArchitecturalScene, { type SceneHotspot } from "./scenes/ArchitecturalScene";
import styles from "./GrandLobbyExperience.module.css";

type SkylineView = "lounge" | "arrival" | "booth" | "city";
type ActionId =
  | "entrance"
  | "bar"
  | "seat"
  | "city"
  | "return-seat"
  | "return-lounge";
type ViewAction = {
  id: ActionId;
  label: string;
  destination: SkylineView;
  focus: ActionId;
};

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
  booth: {
    label: "Window-side booth",
    src: "/images/skyline-lounge/skyline-window-booth-night.webp",
    alt: "A curved burgundy booth and a lamp-lit table beside a tall, rain-streaked Skyline Lounge window.",
    width: 1671,
    height: 941,
  },
  city: {
    label: "City windows",
    src: "/images/skyline-lounge/skyline-city-windows-night.webp",
    alt: "Nighttime city lights seen through the Skyline Lounge's tall arched windows, with rain on the glass and a candlelit table in the foreground.",
    width: 1671,
    height: 941,
  },
} as const;

const TAKE_A_SEAT = {
  id: "seat",
  label: "Take a Seat",
  destination: "booth",
  focus: "return-lounge",
} as const satisfies ViewAction;

const LOOK_OUT_AT_THE_CITY = {
  id: "city",
  label: "Look Out at the City",
  destination: "city",
  focus: "return-seat",
} as const satisfies ViewAction;

const RETURN_TO_LOUNGE = {
  id: "return-lounge",
  label: "Return to Lounge",
  destination: "lounge",
  focus: "seat",
} as const satisfies ViewAction;

const VIEW_ACTIONS: Record<SkylineView, ViewAction[]> = {
  lounge: [
    TAKE_A_SEAT,
    {
      id: "entrance",
      label: "Look toward the entrance",
      destination: "arrival",
      focus: "bar",
    },
  ],
  arrival: [
    {
      id: "bar",
      label: "Look toward the bar",
      destination: "lounge",
      focus: "entrance",
    },
  ],
  booth: [LOOK_OUT_AT_THE_CITY, RETURN_TO_LOUNGE],
  city: [
    {
      id: "return-seat",
      label: "Return to Seat",
      destination: "booth",
      focus: "city",
    },
    RETURN_TO_LOUNGE,
  ],
};

export default function SkylineLoungeExperience({
  initialView = "lounge",
}: {
  initialView?: "lounge" | "arrival";
}) {
  const [view, setView] = useState<SkylineView>(initialView);
  const directoryRef = useRef<HTMLElement>(null);
  const focusTargetRef = useRef<ActionId | null>(null);

  const scene = SKYLINE_SCENES[view];
  const actions = VIEW_ACTIONS[view];
  const hasReturnToLobby = view === "lounge" || view === "arrival";

  useEffect(() => {
    const arrivalImage = new window.Image();
    arrivalImage.src = SKYLINE_SCENES.arrival.src;
  }, []);

  useEffect(() => {
    const focusTarget = focusTargetRef.current;
    if (!focusTarget) return;

    const frame = window.requestAnimationFrame(() => {
      directoryRef.current
        ?.querySelector<HTMLButtonElement>(`[data-skyline-action="${focusTarget}"]`)
        ?.focus({ preventScroll: true });
      focusTargetRef.current = null;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [view]);

  function changeView(action: ViewAction) {
    focusTargetRef.current = action.focus;
    setView(action.destination);
  }

  let hotspots: SceneHotspot[] = [];
  if (view === "arrival") {
    hotspots = [
      {
        id: "blue-hour",
        label: "The Blue Hour",
        description: "Enter the adjoining performance room.",
        href: ROUTES.blueHour,
        bounds: { left: 78, top: 18, width: 15, height: 52 },
      },
    ];
  } else if (view === "lounge") {
    hotspots = [
      {
        id: "window-side-booth",
        label: TAKE_A_SEAT.label,
        bounds: { left: 72, top: 63, width: 15, height: 15 },
        onActivate: () => changeView(TAKE_A_SEAT),
      },
    ];
  } else if (view === "booth") {
    hotspots = [
      {
        id: "city-facing-window",
        label: LOOK_OUT_AT_THE_CITY.label,
        narrowLabelAlign: "end",
        bounds: { left: 76, top: 24, width: 11.5, height: 26 },
        onActivate: () => changeView(LOOK_OUT_AT_THE_CITY),
      },
    ];
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

      <div className={`${styles.sceneArea} ${styles.skylineSceneArea}`}>
        <ArchitecturalScene
          sceneId={`skyline-${view}`}
          sceneLabel={scene.label}
          imageSrc={scene.src}
          imageAlt={scene.alt}
          imageWidth={scene.width}
          imageHeight={scene.height}
          hotspots={hotspots}
          priority={view === "lounge"}
        />
      </div>

      <nav
        ref={directoryRef}
        className={`${styles.directory} ${styles.skylineDirectory}`}
        aria-label="Skyline Lounge navigation"
      >
        {actions.map((action, index) => (
          <Fragment key={action.id}>
            {index > 0 ? <span aria-hidden="true" /> : null}
            <button
              type="button"
              data-skyline-action={action.id}
              onClick={() => changeView(action)}
            >
              {action.label}
            </button>
          </Fragment>
        ))}
        {view === "arrival" ? (
          <>
            <span aria-hidden="true" />
            <Link href={ROUTES.blueHour}>Enter The Blue Hour</Link>
          </>
        ) : null}
        {hasReturnToLobby ? (
          <>
            <span aria-hidden="true" />
            <Link href={ROUTES.lobby}>Return to Lobby</Link>
          </>
        ) : null}
      </nav>
    </main>
  );
}
