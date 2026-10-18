"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { site } from "@/data/site";
import { mailtoHref, telHref, whatsappHref } from "@/lib/links";
import { Container } from "@/components/ui/Container";

const ease = [0.22, 1, 0.36, 1] as const;

type ContactAction = {
  href: string;
  label: string;
  value: string;
  external: boolean;
  icon: "mail" | "whatsapp" | "instagram" | "phone";
};

export function Contact() {
  const rootRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const email = mailtoHref(site.email);
  const phone = telHref(site.phone);
  const whatsapp = whatsappHref(site.whatsapp);
  const instagram = site.socials.find((item) => item.label === "Instagram")?.href;

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
          gsap.from("[data-contact-line]", {
            yPercent: 110,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: root, start: "top 75%" },
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

  const actions: ContactAction[] = [
    email
      ? { href: email, label: "Email", value: site.email, external: false, icon: "mail" }
      : null,
    whatsapp
      ? {
          href: whatsapp,
          label: "WhatsApp",
          value: site.phone,
          external: true,
          icon: "whatsapp",
        }
      : null,
    instagram
      ? {
          href: instagram,
          label: "Instagram",
          value: "@aman.koroth",
          external: true,
          icon: "instagram",
        }
      : null,
    phone
      ? { href: phone, label: "Call", value: site.phone, external: false, icon: "phone" }
      : null,
  ].filter((item): item is ContactAction => item !== null);

  return (
    <section id="contact" ref={rootRef} className="shade-contact relative overflow-hidden border-t border-line">
      <Container className="relative py-24 md:py-32">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-accent">Contact</p>
            <h2 className="mt-5 max-w-full font-display text-[clamp(3rem,8vw,5.6rem)] font-medium leading-[0.88] tracking-[-0.03em] text-ink">
              <span className="block overflow-hidden">
                <span data-contact-line className="block">
                  Have a story
                </span>
              </span>
              <span className="block overflow-hidden">
                <span data-contact-line className="block italic">
                  in mind?
                </span>
              </span>
            </h2>
            <p className="mt-6 max-w-sm font-sans text-base leading-relaxed tracking-wide text-muted">
              {site.contactNote}
            </p>
          </div>

          <motion.ul
            className="grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:col-span-7"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            variants={{
              hidden: {},
              show: {
                transition: reduce ? { duration: 0 } : { staggerChildren: 0.08 },
              },
            }}
          >
            {actions.map((action) => (
              <motion.li
                key={action.label}
                variants={{
                  hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: reduce ? 0 : 0.45, ease }}
              >
                <a
                  href={action.href}
                  className="group flex min-h-14 items-center gap-3 border-b border-line px-1 py-3 sm:px-3"
                  {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <ContactMark name={action.icon} />
                  <span className="min-w-0 flex-1">
                    <span className="block font-sans text-[0.62rem] uppercase tracking-[0.18em] text-muted">
                      {action.label}
                    </span>
                    <span className="mt-0.5 block max-w-full break-words font-sans text-sm leading-snug text-ink">
                      {action.value}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                  >
                    →
                  </span>
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </Container>
    </section>
  );
}

function ContactMark({ name }: { name: ContactAction["icon"] }) {
  if (name === "whatsapp") {
    return (
      <svg viewBox="0 0 36 36" className="h-8 w-8 shrink-0" aria-hidden="true">
        <circle cx="18" cy="18" r="18" fill="#25D366" />
        <path
          fill="#fff"
          d="M18.2 8.2a9.7 9.7 0 0 0-8.4 14.6L8.6 27.4l4.7-1.2A9.7 9.7 0 1 0 18.2 8.2Zm5.5 13.7c-.24.66-1.38 1.26-1.9 1.34-.5.08-1.1.1-1.78-.1-.4-.13-.93-.3-1.6-.6-2.82-1.22-4.66-4.06-4.8-4.25-.14-.19-1.12-1.49-1.12-2.84s.7-2.01.96-2.29c.25-.27.52-.34.7-.34h.5c.16 0 .37-.06.58.45.22.55.78 1.89.85 2.03.07.14.11.3.02.47-.09.18-.14.3-.28.46-.14.16-.28.36-.4.48-.14.14-.28.28-.12.55.16.27.71 1.17 1.52 1.89 1.05.93 1.93 1.22 2.2 1.36.28.14.43.12.59-.07.16-.18.68-.79.86-1.06.18-.28.36-.23.61-.14.25.09 1.56.74 1.83.87.27.14.45.2.52.32.06.11.06.65-.17 1.31Z"
        />
      </svg>
    );
  }

  if (name === "instagram") {
    return (
      <svg viewBox="0 0 36 36" className="h-8 w-8 shrink-0" aria-hidden="true">
        <defs>
          <radialGradient id="contact-instagram" cx="30%" cy="110%" r="125%">
            <stop offset="0%" stopColor="#feda75" />
            <stop offset="28%" stopColor="#fa7e1e" />
            <stop offset="52%" stopColor="#d62976" />
            <stop offset="76%" stopColor="#962fbf" />
            <stop offset="100%" stopColor="#4f5bd5" />
          </radialGradient>
        </defs>
        <rect width="36" height="36" rx="9" fill="url(#contact-instagram)" />
        <rect x="9.2" y="9.2" width="17.6" height="17.6" rx="5" fill="none" stroke="#fff" strokeWidth="1.8" />
        <circle cx="18" cy="18" r="4.1" fill="none" stroke="#fff" strokeWidth="1.8" />
        <circle cx="24.2" cy="11.8" r="1.15" fill="#fff" />
      </svg>
    );
  }

  const path =
    name === "mail"
      ? "M4 7.5h16v11H4v-11Zm0 0 8 6.2L20 7.5"
      : "M8.2 4.8h2.2l1.3 3.2-1.6 1a11.2 11.2 0 0 0 5 5l1-1.6 3.2 1.3v2.2A1.8 1.8 0 0 1 17.5 18 13.7 13.7 0 0 1 6 6.6a1.8 1.8 0 0 1 2.2-1.8Z";

  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-accent">
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none">
        <path d={path} stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
