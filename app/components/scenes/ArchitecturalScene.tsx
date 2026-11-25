"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import type { CSSProperties, MouseEventHandler } from "react";
import styles from "./ArchitecturalScene.module.css";

type SceneHotspotBase = {
  id: string;
  label: string;
  description?: string;
  narrowLabelAlign?: "start" | "end";
  bounds: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  controls?: string;
  expanded?: boolean;
};

export type SceneHotspot = SceneHotspotBase &
  (
    | { href: Route; onActivate?: never }
    | {
        href?: never;
        onActivate: MouseEventHandler<HTMLButtonElement>;
      }
  );

type ArchitecturalSceneProps = {
  sceneId: string;
  sceneLabel: string;
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  alternateImageSrc?: string;
  alternateImageVisible?: boolean;
  hotspots: SceneHotspot[];
  priority?: boolean;
};

const narrowLabelClasses = {
  start: styles.labelAlignStart,
  end: styles.labelAlignEnd,
};

export default function ArchitecturalScene({
  sceneId,
  sceneLabel,
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  alternateImageSrc,
  alternateImageVisible = false,
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

          {alternateImageSrc ? (
            <Image
              className={`${styles.image} ${styles.alternateImage} ${
                alternateImageVisible ? styles.alternateImageVisible : ""
              }`}
              src={alternateImageSrc}
              alt=""
              fill
              sizes="100vw"
              aria-hidden="true"
            />
          ) : null}

          <div className={styles.hotspots}>
            {hotspots.map((hotspot) => {
              const hotspotStyle = {
                left: `${hotspot.bounds.left}%`,
                top: `${hotspot.bounds.top}%`,
                width: `${hotspot.bounds.width}%`,
                height: `${hotspot.bounds.height}%`,
              };
              const accessibleLabel = hotspot.description
                ? `${hotspot.label}. ${hotspot.description}`
                : hotspot.label;
              const content = (
                <>
                  <span className={styles.marker} aria-hidden="true" />
                  <span
                    className={
                      hotspot.narrowLabelAlign
                        ? `${styles.label} ${narrowLabelClasses[hotspot.narrowLabelAlign]}`
                        : styles.label
                    }
                    aria-hidden="true"
                  >
                    <strong>{hotspot.label}</strong>
                    {hotspot.description ? (
                      <small>{hotspot.description}</small>
                    ) : null}
                  </span>
                </>
              );

              if (hotspot.href) {
                return (
                  <Link
                    key={hotspot.id}
                    className={styles.hotspot}
                    style={hotspotStyle}
                    href={hotspot.href}
                    aria-label={accessibleLabel}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={hotspot.id}
                  type="button"
                  className={styles.hotspot}
                  style={hotspotStyle}
                  onClick={hotspot.onActivate}
                  aria-label={accessibleLabel}
                  aria-controls={hotspot.controls}
                  aria-expanded={hotspot.expanded}
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
