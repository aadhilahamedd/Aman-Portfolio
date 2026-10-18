"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function CaseHeader({
  number,
  total,
  title,
  category,
  year,
}: {
  number: string;
  total: string;
  title: string;
  category: string;
  year?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.header
      initial={reduce ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="text-[0.72rem] uppercase tracking-[0.18em] text-accent">
        {number} / {total}
      </p>
      <h1 className="mt-4 max-w-full font-display text-[clamp(2.4rem,11vw,6.4rem)] italic leading-[0.9] text-ink">
        {title}
      </h1>
      <p className="mt-4 text-[0.72rem] uppercase tracking-[0.16em] text-muted">
        {category}
        {year ? ` · ${year}` : ""}
      </p>
    </motion.header>
  );
}

export function CaseMedia({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="mt-10"
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
