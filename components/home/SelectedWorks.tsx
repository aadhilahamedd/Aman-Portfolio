"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { Project } from "@/data/projects";

export function SelectedWorks({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState("All");
  const reduce = useReducedMotion();
  const categories = Array.from(new Set(projects.map((project) => project.category)));
  const filters = ["All", ...categories];
  const cinematic = projects.filter(
    (project) => project.orientation === "landscape" && (filter === "All" || project.category === filter),
  );
  const portrait = projects.filter(
    (project) => project.orientation === "portrait" && (filter === "All" || project.category === filter),
  );
  const split = filter === "All";

  return (
    <div>
      {categories.length > 1 ? (
        <div
          role="group"
          aria-label="Filter projects"
          className="mb-8 flex flex-wrap justify-center gap-x-7 gap-y-2 md:mb-10"
        >
          {filters.map((item) => {
            const selected = filter === item;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={selected}
                onClick={() => setFilter(item)}
                className={`relative min-h-11 px-1 text-[0.72rem] uppercase tracking-[0.16em] transition-colors ${
                  selected ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {item}
                {selected ? (
                  <motion.span
                    layoutId={reduce ? undefined : "filter-line"}
                    className="absolute inset-x-0 bottom-2 h-px bg-accent"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}

      {split ? (
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[minmax(0,1.75fr)_minmax(0,0.82fr)] md:gap-5">
          <ul className="flex min-w-0 flex-col gap-4 md:gap-5">
            {cinematic.map((project, index) => (
              <li key={project.slug}>
                <ProjectCard
                  project={project}
                  showcase
                  delay={reduce ? 0 : Math.min(index * 0.06, 0.3)}
                />
              </li>
            ))}
          </ul>
          <ul className="flex min-w-0 flex-col gap-4 md:gap-5">
            {portrait.map((project, index) => (
              <li key={project.slug}>
                <ProjectCard
                  project={project}
                  showcase
                  delay={reduce ? 0 : Math.min(index * 0.06, 0.24)}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <ul
          className={`grid grid-cols-1 gap-4 ${
            portrait.length > 0 ? "sm:grid-cols-2 lg:grid-cols-3" : ""
          }`}
        >
          {(cinematic.length > 0 ? cinematic : portrait).map((project, index) => (
            <li key={project.slug} className="min-w-0">
              <ProjectCard project={project} showcase delay={reduce ? 0 : Math.min(index * 0.06, 0.3)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
