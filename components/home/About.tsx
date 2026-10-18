"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { site } from "@/data/site";
import { Container } from "@/components/ui/Container";

export function About() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let revert: (() => void) | undefined;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ default: gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const context = gsap.context(() => {
          gsap.from("[data-about-portrait]", {
            clipPath: "inset(14% 0 0 0)",
            duration: 1.05,
            ease: "power3.out",
            scrollTrigger: { trigger: root, start: "top 78%" },
          });
          gsap.from("[data-about-line]", {
            yPercent: 110,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: root, start: "top 72%" },
          });
          gsap.from("[data-about-copy]", {
            y: 18,
            autoAlpha: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: root, start: "top 68%" },
          });
          gsap.from("[data-about-mark]", {
            y: 12,
            autoAlpha: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: { trigger: "[data-about-marks]", start: "top 85%" },
          });
          gsap.from("[data-about-rule]", {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: "[data-about-marks]", start: "top 88%" },
          });
        }, root);
        revert = () => context.revert();
      },
    );

    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return (
    <section id="about" ref={rootRef} className="shade-about py-24 md:py-32">
      <Container>
        <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div
              data-about-portrait
              className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden border border-line bg-surface sm:max-w-lg lg:max-w-none"
            >
              <Image
                src={site.portrait.image}
                alt={site.portrait.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-center"
              />
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="mb-4 text-[0.72rem] uppercase tracking-[0.18em] text-muted">
              About <span className="text-accent">/ 03</span>
            </p>
            <h2 className="overflow-hidden font-display text-[clamp(2.8rem,6vw,5.2rem)] leading-[0.9] text-ink">
              <span data-about-line className="block">
                {site.name}
              </span>
            </h2>
            <p data-about-copy className="mt-8 max-w-xl text-base leading-relaxed text-ink/90 sm:text-lg">
              {site.biography}
            </p>
            <div data-about-rule className="mt-10 h-px w-full origin-left bg-line" />
            <div data-about-marks className="mt-8 grid gap-8 sm:grid-cols-2">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.18em] text-accent">Work</p>
                <ul className="mt-4 space-y-3">
                  {site.work.map((item, index) => (
                    <li key={item} data-about-mark className="flex items-baseline gap-3">
                      <span className="text-[0.68rem] tracking-[0.14em] text-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm text-ink">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.18em] text-accent">Craft</p>
                <ul className="mt-4 space-y-3">
                  {site.craft.map((item) => (
                    <li key={item} data-about-mark className="text-sm text-ink">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t border-line pt-6">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-accent">Software</p>
              <ul className="mt-4 flex flex-col gap-4 sm:flex-row sm:gap-10">
                {site.software.map((item) => (
                  <li key={item} data-about-mark className="flex items-center gap-3">
                    <SoftwareMark name={item} />
                    <span className="font-display text-2xl text-ink sm:text-3xl">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

const softwareIcons: Record<string, string> = {
  "DaVinci Resolve": "/media/logos/davinci-resolve.svg",
  CapCut: "/media/logos/capcut.svg",
};

function SoftwareMark({ name }: { name: string }) {
  const src = softwareIcons[name];
  if (!src) return null;

  return (
    <img
      src={src}
      alt=""
      width={36}
      height={36}
      className="h-9 w-9 shrink-0 object-contain"
    />
  );
}
