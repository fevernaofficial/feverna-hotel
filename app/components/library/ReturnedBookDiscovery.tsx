"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./ReturnedBookDiscovery.module.css";

type ReturnedBookDiscoveryProps = {
  open: boolean;
  onDismiss: () => void;
};

export default function ReturnedBookDiscovery({
  open,
  onDismiss,
}: ReturnedBookDiscoveryProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const frame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
    });

    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      onDismiss();
    };

    document.addEventListener("keydown", dismissOnEscape);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", dismissOnEscape);
    };
  }, [onDismiss, open]);

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.veil} aria-hidden="true" />

      <section
        id="returned-book-discovery"
        className={styles.panel}
        role="dialog"
        aria-modal="false"
        aria-labelledby="returned-book-title"
        aria-describedby="returned-book-description"
      >
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Library discovery</p>
            <h2 id="returned-book-title">The Returned Book</h2>
            <p id="returned-book-description" className={styles.description}>
              A library book, its borrowing record, and a letter left inside.
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className={styles.closeButton}
            onClick={onDismiss}
          >
            Close
          </button>
        </header>

        <div className={styles.content}>
          <figure className={styles.artworkFrame}>
            <Image
              className={styles.artwork}
              src="/images/library/returned-book.webp"
              alt="A worn copy of Bridges and Their Construction beside its Hotel Feverna borrowing record, Daniel Mercer's letter, and his drawing of a footbridge by an old mill."
              width={1448}
              height={1086}
              sizes="(max-width: 760px) calc(100vw - 1.5rem), 68vw"
            />
            <figcaption>
              The returned book, borrowing record, letter, and bridge drawing.
            </figcaption>
          </figure>

          <aside className={styles.transcriptions} aria-label="Artifact transcriptions">
            <p className={styles.transcriptionHeading}>Transcriptions</p>

            <details className={styles.transcription}>
              <summary>Daniel Mercer&apos;s note</summary>
              <article className={styles.letter}>
                <p className={styles.date}>3 June 1986</p>
                <p>Dear Miss Vale,</p>
                <p>
                  I&apos;ve put a drawing inside the book. The footbridge opened
                  last spring. It crosses the river by the old mill—not a grand
                  thing, but I&apos;m pleased with it, and I thought you might like
                  to see.
                </p>
                <p>
                  I remember showing you my sketches in this library. Everyone
                  else told me they were very good. You showed me why the
                  arches wouldn&apos;t stand. I was rather put out at the time.
                </p>
                <p>
                  I&apos;ve meant to return this book for years. Twice I came
                  looking for the hotel and couldn&apos;t find the street. I must
                  have remembered it badly, because I found it without any
                  trouble today.
                </p>
                <p>
                  I don&apos;t know whether this will ever reach you. But thank
                  you for taking the time.
                </p>
                <p className={styles.signature}>Daniel Mercer</p>
              </article>
            </details>

            <details className={styles.transcription}>
              <summary>Library borrowing record</summary>
              <div className={styles.record}>
                <p className={styles.recordHeading}>Hotel Feverna — Library</p>
                <p className={styles.recordTitle}>Bridges and Their Construction</p>
                <dl>
                  <div>
                    <dt>Borrowed</dt>
                    <dd>14 October 1938</dd>
                  </div>
                  <div>
                    <dt>Name</dt>
                    <dd>Miss Miriam Vale</dd>
                  </div>
                  <div>
                    <dt>Returned</dt>
                    <dd>3 June 1986</dd>
                  </div>
                  <div>
                    <dt>Received from</dt>
                    <dd>Daniel Mercer</dd>
                  </div>
                </dl>
              </div>
            </details>
          </aside>
        </div>
      </section>
    </div>
  );
}
