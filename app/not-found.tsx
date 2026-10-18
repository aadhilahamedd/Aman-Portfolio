import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="shade-case min-h-[70vh]">
    <div className="mx-auto flex min-h-[70vh] w-full max-w-[90rem] flex-col justify-end px-4 py-28 sm:px-6 lg:px-10">
      <p className="text-[0.72rem] uppercase tracking-[0.18em] text-accent">404</p>
      <h1 className="mt-4 max-w-4xl font-display text-[clamp(3.2rem,8vw,6.5rem)] uppercase leading-[0.9] text-ink">
        Page not found
      </h1>
      <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
        This link does not match a page in the portfolio.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-11 w-fit items-center gap-3 text-[0.78rem] uppercase tracking-[0.16em] text-ink"
      >
        <span className="border-b border-accent pb-1">Back Home</span>
        <span aria-hidden="true">→</span>
      </Link>
    </div>
    </div>
  );
}
