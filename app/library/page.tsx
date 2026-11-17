import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import styles from "../components/GrandLobbyExperience.module.css";
import ArchitecturalScene from "../components/scenes/ArchitecturalScene";
import { ROUTES } from "../routes";

const LIBRARY_SCENE = {
  label: "The Library",
  src: "/images/Rainy-Hotel-Library.webp",
  alt: "The library of Hotel Feverna, with bookshelves, a lit fireplace, reading chairs, a long study table, and rain against tall Gothic windows.",
  width: 1672,
  height: 941,
} as const;

export const metadata: Metadata = {
  title: "Library | Hotel Feverna",
  description:
    "Enter the quiet library of Hotel Feverna and remain as long as you wish.",
};

export default function LibraryPage() {
  return (
    <main
      className={styles.lobby}
      style={
        { "--lobby-backdrop": `url('${LIBRARY_SCENE.src}')` } as CSSProperties
      }
    >
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.shade} aria-hidden="true" />

      <header className={styles.heading}>
        <p>Hotel Feverna</p>
        <h1>Library</h1>
      </header>

      <div className={styles.sceneArea}>
        <ArchitecturalScene
          sceneId="library"
          sceneLabel={LIBRARY_SCENE.label}
          imageSrc={LIBRARY_SCENE.src}
          imageAlt={LIBRARY_SCENE.alt}
          imageWidth={LIBRARY_SCENE.width}
          imageHeight={LIBRARY_SCENE.height}
          hotspots={[]}
          priority
        />
      </div>

      <nav className={styles.directory} aria-label="Library navigation">
        <Link href={ROUTES.lobby}>Return to Lobby</Link>
      </nav>
    </main>
  );
}
