import type { SocialLink } from "@/data/site";

export function mailtoHref(email: string) {
  const value = email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return null;
  return `mailto:${value}`;
}

export function whatsappHref(number: string) {
  const digits = number.replace(/[^\d]/g, "");
  if (!/^\d{8,15}$/.test(digits)) return null;
  return `https://wa.me/${digits}`;
}

export function telHref(phone: string) {
  const digits = phone.replace(/[^\d]/g, "");
  if (!/^\d{8,15}$/.test(digits)) return null;
  return `tel:+${digits}`;
}

export function safeSocialLinks(socials: SocialLink[]) {
  return socials.flatMap((social) => {
    try {
      const url = new URL(social.href);
      if (url.protocol !== "https:") return [];
      const label = social.label.trim();
      if (!label) return [];
      return [{ label, href: url.toString() }];
    } catch {
      return [];
    }
  });
}

export function allowedEmbedUrl(value: string | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;

    const host = url.hostname.toLowerCase();
    const youtube =
      host === "youtube.com" ||
      host === "www.youtube.com" ||
      host === "youtube-nocookie.com" ||
      host === "www.youtube-nocookie.com";

    if (youtube && url.pathname.startsWith("/embed/")) {
      return url.toString();
    }

    if (host === "player.vimeo.com" && url.pathname.startsWith("/video/")) {
      return url.toString();
    }
  } catch {
    return null;
  }

  return null;
}
