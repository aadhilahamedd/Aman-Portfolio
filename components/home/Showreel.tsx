"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { ProjectVideo } from "@/components/projects/ProjectVideo";
import { Container } from "@/components/ui/Container";
import { projects } from "@/data/projects";

export function Showreel() {
  const films = projects.filter(
    (project) => project.orientation === "landscape" && project.videoSrc,
  );
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const film = films[index];

  if (!film) return null;

  function step(direction: number) {
    setIndex((current) => (current + direction + films.length) % films.length);
  }

  return (
    <section id="showreel" className="shade-showreel py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[0.72rem] uppercase tracking-[0.22em] text-muted">Showreel</p>
          <h2 className="mt-4 font-display text-[clamp(2.2rem,6vw,3.8rem)] leading-none text-ink">
            See some of my work
          </h2>
          <p className="mt-3 text-sm text-muted sm:text-base">A collection of moments.</p>
        </div>

        <div className="mx-auto mt-10 max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={film.slug}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectVideo
                src={film.videoSrc}
                poster={film.thumbnail}
                title={film.title}
                orientation="landscape"
                playLabel="Play"
                iconOnly
              />
            </motion.div>
          </AnimatePresence>

          <div className="mt-5 flex items-center justify-center gap-3 sm:gap-4">
            <p className="text-[0.72rem] uppercase tracking-[0.16em] text-muted">
              Next video{" "}
              <span className="text-ink">
                {index + 1}/{films.length}
              </span>
            </p>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent"
              onClick={() => step(-1)}
              aria-label="Previous film"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path d="M14.5 6.5 9 12l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent"
              onClick={() => step(1)}
              aria-label="Next film"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path d="M9.5 6.5 15 12l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted">{film.category}</p>
              <h3 className="mt-2 font-display text-[clamp(1.8rem,4vw,3rem)] leading-none text-ink">
                {film.title}
              </h3>
            </div>
            <Link
              href={`/work/${film.slug}`}
              className="inline-flex min-h-11 items-center text-[0.72rem] uppercase tracking-[0.16em] text-ink"
            >
              <span className="border-b border-accent pb-1">View film</span>
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
