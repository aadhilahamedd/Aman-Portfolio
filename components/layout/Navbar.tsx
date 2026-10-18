"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { site } from "@/data/site";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Navbar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const solid = pathname !== "/" || scrolled || open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduce ? 0 : 0.6, ease, delay: reduce ? 0 : 0.05 }}
    >
      <div
        className={`relative z-50 ${
          solid ? "border-b border-line bg-background/80 backdrop-blur-md" : ""
        }`}
      >
      <div className="mx-auto flex h-16 w-full max-w-[90rem] items-center justify-between px-4 sm:h-[4.5rem] sm:px-6 lg:px-10">
        <Link href="/" className="font-display text-[1.35rem] leading-none text-ink">
          {site.name}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative py-2 text-sm text-muted transition-colors hover:text-ink"
            >
              {link.label}
              <span className="absolute inset-x-0 bottom-1 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100 motion-reduce:transition-none" />
            </Link>
          ))}
        </nav>

        <button
          ref={buttonRef}
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center text-ink md:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="flex w-6 flex-col gap-[5px]" aria-hidden="true">
            <span
              className={`h-px w-full bg-ink transition motion-reduce:transition-none ${open ? "translate-y-[6px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-full bg-ink transition motion-reduce:transition-none ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`h-px w-full bg-ink transition motion-reduce:transition-none ${open ? "-translate-y-[6px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id={menuId}
            aria-label="Mobile"
            className="fixed inset-0 z-40 flex flex-col justify-end bg-background px-6 pb-16 pt-24 md:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.3, ease }}
          >
            <motion.ul
              className="flex flex-col gap-5"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: reduce
                    ? { duration: 0 }
                    : { staggerChildren: 0.08, delayChildren: 0.08 },
                },
              }}
            >
              {links.map((link) => (
                <motion.li
                  key={link.href}
                  variants={{
                    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
                    show: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: reduce ? 0 : 0.45, ease }}
                >
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center font-display text-[clamp(2.6rem,12vw,3.4rem)] italic leading-none text-ink"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
