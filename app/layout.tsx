import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { site } from "@/data/site";
import { productionOrigin } from "@/lib/site-url";
import "./globals.css";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const description = `${site.name} is a ${site.role.toLowerCase()}. ${site.headline} ${site.heroNote}`;
const origin = productionOrigin();

export const metadata: Metadata = {
  ...(origin ? { metadataBase: origin } : {}),
  title: {
    default: `${site.name} — Video Editor`,
    template: `%s — ${site.name}`,
  },
  description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  ...(origin ? { alternates: { canonical: "/" } } : {}),
  openGraph: {
    title: `${site.name} — Video Editor`,
    description,
    type: "website",
    locale: "en_US",
    ...(origin
      ? { images: [{ url: site.hero.image, alt: site.hero.alt }] }
      : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Video Editor`,
    description,
    ...(origin ? { images: [site.hero.image] } : {}),
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${display.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
