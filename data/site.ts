export type SocialLink = {
  label: string;
  href: string;
};

/**
 * Only confirmed profile URLs belong here.
 */
export const site = {
  name: "Aman Koroth",
  role: "Video Editor",
  headline: "I Turn Moments Into Stories.",
  supporting: "Every cut has a purpose. Every frame has a feeling.",
  heroNote:
    "Video editor crafting cinematic stories through rhythm, emotion and motion.",
  contactNote: "Let's turn your idea into something worth watching.",
  biography:
    "Video editor working on brand advertisements, promotional videos, social media content, and music videos. My work includes visual storytelling, color grading, sound design, and transitions, with attention to pacing, visual consistency, and the overall flow of each video.",
  work: [
    "Brand advertisements",
    "Promotional videos",
    "Social media content",
    "Music videos",
  ],
  craft: ["Visual storytelling", "Color grading", "Sound design", "Transitions"],
  software: ["DaVinci Resolve", "CapCut"],
  email: "amankoroth1234@gmail.com",
  phone: "+91 85474 61831",
  whatsapp: "918547461831",
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/aman.koroth" },
  ] as SocialLink[],
  /**
   * Set the live site origin when the domain is known.
   * Example: "https://example.com"
   * NEXT_PUBLIC_SITE_URL overrides this at build time.
   */
  url: "",
  /**
   * No dedicated showreel file was supplied.
   * This player uses Cinematic 05 until a showreel is added.
   * Source: public/Details/Cinematic/Work 5.MP4
   */
  showreel: {
    src: "/media/cinematic/work-5.mp4",
    poster: "/media/cinematic/work-5.jpg",
    title: "Cinematic 05",
    href: "/work/cinematic-05",
  },
  /**
   * Hero background is Cinematic 03, played muted.
   * Source: public/Details/Cinematic/Work 3
   */
  hero: {
    video: "/media/cinematic/work-3.mp4",
    image: "/media/cinematic/work-3.jpg",
    alt: "Black and white view down a forest path",
  },
  /**
   * About portrait.
   * Source: public/Details/Personal Photo/AMAN 2
   */
  portrait: {
    image: "/media/photos/aman-2.jpg",
    alt: "Aman Koroth standing beside a red car",
  },
} as const;
