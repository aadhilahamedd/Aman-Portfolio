"use client";

import { useEffect, useRef } from "react";
import { site } from "@/data/site";

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let revert: (() => void) | undefined;

    void import("gsap").then(({ default: gsap }) => {
      if (cancelled) return;
      const context = gsap.context(() => {
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
        timeline
          .fromTo(
            "[data-hero-veil]",
            { opacity: 0.72 },
            { opacity: 0, duration: 0.9 },
            0,
          )
          .from(
            "[data-hero-line]",
            { yPercent: 110, duration: 0.85, stagger: 0.08 },
            0.12,
          )
          .from("[data-hero-scroll]", { autoAlpha: 0, duration: 0.6 }, 0.7);
      }, root);
      revert = () => context.revert();
    });

    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100svh] items-end overflow-hidden"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={site.hero.video}
        poster={site.hero.image}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/35" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(183,161,122,0.2),transparent_58%)]" />
      <div data-hero-veil className="pointer-events-none absolute inset-0 bg-background opacity-0" />

      <div className="relative z-10 mx-auto w-full max-w-[90rem] px-4 pb-28 pt-28 sm:px-6 sm:pb-32 lg:px-10">
        <p className="overflow-hidden font-display text-[clamp(1.35rem,3vw,2rem)] italic leading-none text-ink/80">
          <span data-hero-line className="block">
            {site.name}
          </span>
        </p>
        <h1 className="mt-3 max-w-full font-display leading-[0.92] tracking-tight text-ink text-[clamp(2.05rem,9vw,7.2rem)]">
          <span className="block overflow-hidden">
            <span data-hero-line className="block">
              I Turn Moments
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-hero-line className="block italic">
              Into Stories.
            </span>
          </span>
        </h1>
      </div>

      <a
        data-hero-scroll
        href="#showreel"
        className="absolute bottom-6 left-1/2 z-10 flex min-h-11 -translate-x-1/2 flex-col items-center justify-end gap-3 text-[0.65rem] uppercase tracking-[0.18em] text-muted"
      >
        <span>Scroll</span>
        <span className="scroll-line" aria-hidden="true" />
      </a>
    </section>
  );
}
