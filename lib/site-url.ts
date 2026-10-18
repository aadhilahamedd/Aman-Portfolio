import { site } from "@/data/site";

export function productionOrigin() {
  const value = process.env.NEXT_PUBLIC_SITE_URL || site.url;
  if (!value) return null;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url;
  } catch {
    return null;
  }
}
