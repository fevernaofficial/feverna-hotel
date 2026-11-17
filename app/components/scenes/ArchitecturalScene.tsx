"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "./ArchitecturalScene.module.css";

export type SceneHotspot = {
  id: string;
  label: string;
  description?: string;
  bounds: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  onActivate: () => void;
  controls?: string;
  expanded?: boolean;
};

type ArchitecturalSceneProps = {
  sceneId: string;
  sceneLabel: string;
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  hotspots: SceneHotspot[];
  priority?: boolean;
};

export default function ArchitecturalScene({
  sceneId,
  sceneLabel,
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  hotspots,
  priority = false,
}: ArchitecturalSceneProps) {
  const sceneStyle = {
    "--scene-aspect": `${imageWidth} / ${imageHeight}`,
    "--scene-ratio": imageWidth / imageHeight,
  } as CSSProperties;

  return (
    <section className={styles.scene} aria-label={sceneLabel}>
      <div className={styles.stage} style={sceneStyle}>
        <div key={sceneId} className={styles.canvas}>
          <Image
            className={styles.image}
            src={imageSrc}
            alt={imageAlt}
            fill
            priority={priority}
            sizes="100vw"
          />

          <div className={styles.hotspots}>
            {hotspots.map((hotspot) => {
              const hotspotStyle = {
                left: `${hotspot.bounds.left}%`,
                top: `${hotspot.bounds.top}%`,
                width: `${hotspot.bounds.width}%`,
                height: `${hotspot.bounds.height}%`,
              };

              return (
                <button
                  key={hotspot.id}
                  type="button"
                  className={styles.hotspot}
                  style={hotspotStyle}
                  onClick={hotspot.onActivate}
                  aria-label={
                    hotspot.description
                      ? `${hotspot.label}. ${hotspot.description}`
                      : hotspot.label
                  }
                  aria-controls={hotspot.controls}
                  aria-expanded={hotspot.expanded}
                >
                  <span className={styles.marker} aria-hidden="true" />
                  <span className={styles.label} aria-hidden="true">
                    <strong>{hotspot.label}</strong>
                    {hotspot.description ? (
                      <small>{hotspot.description}</small>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
