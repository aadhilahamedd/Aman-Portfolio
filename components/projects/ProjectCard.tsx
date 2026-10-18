"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { projectNumber, type Project } from "@/data/projects";

export function ProjectCard({
  project,
  delay = 0,
  showcase = false,
}: {
  project: Project;
  delay?: number;
  showcase?: boolean;
}) {
  const reduce = useReducedMotion();
  const number = projectNumber(project.slug);
  const meta = project.year ? `${project.category} · ${project.year}` : project.category;

  return (
    <motion.article
      className="h-full"
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/work/${project.slug}`} className="group flex h-full min-w-0 flex-col">
        <div
          className={`relative overflow-hidden border border-line bg-surface ${
            project.orientation === "portrait"
              ? showcase
                ? "aspect-[3/4]"
                : "aspect-[3/4] md:aspect-[9/16]"
              : "aspect-video"
          }`}
        >
          <motion.div
            className="relative h-full w-full"
            initial={reduce ? false : { scale: 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            whileHover={reduce ? undefined : { scale: 1.045 }}
            transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={project.thumbnail}
              alt={project.imageAlt}
              fill
              sizes="(min-width: 1280px) 50vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>
          <span className="pointer-events-none absolute inset-0 bg-background/10 transition-colors duration-500 group-hover:bg-background/25 motion-reduce:transition-none" />
          {showcase ? (
            <>
              <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black sm:h-12 sm:w-12">
                <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" aria-hidden="true">
                  <path d="M8 5.5v13l11-6.5-11-6.5z" fill="currentColor" />
                </svg>
              </span>
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent px-4 pb-4 pt-16 text-center">
                <span className="block font-display text-[clamp(1.2rem,2vw,1.8rem)] leading-none text-white">
                  {project.title}
                </span>
              </span>
            </>
          ) : null}
        </div>
        {showcase ? null : (
        <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-2 transition-transform duration-500 group-hover:translate-y-[-2px] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
          <div className="min-w-0">
            <p className="text-[0.68rem] tracking-[0.14em] text-accent">{number}</p>
            <h3 className="mt-2 font-display text-[clamp(1.7rem,3vw,2.35rem)] leading-none text-ink">
              {project.title}
            </h3>
            <p className="mt-2 text-[0.68rem] uppercase tracking-[0.16em] text-muted">{meta}</p>
          </div>
          <p className="inline-flex shrink-0 items-center pt-1 text-[0.68rem] uppercase tracking-[0.16em] text-ink">
            View film
            <span
              aria-hidden="true"
              className="ml-2 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
            >
              →
            </span>
          </p>
        </div>
        )}
      </Link>
    </motion.article>
  );
}
