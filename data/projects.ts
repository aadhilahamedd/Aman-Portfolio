export type ProjectCredit = {
  role: string;
  name: string;
};

export type ProjectLayout = "feature" | "wide" | "standard" | "vertical" | "pair";

export type Project = {
  slug: string;
  title: string;
  category: string;
  year?: number;
  description: string;
  thumbnail: string;
  videoSrc?: string;
  videoEmbedUrl?: string;
  featured: boolean;
  credits?: ProjectCredit[];
  orientation: "landscape" | "portrait";
  layout?: ProjectLayout;
  imageAlt: string;
};

/**
 * CONTENT NEEDED: Replace each description with notes from Aman.
 * Years, credits, and client names were not supplied — leave them out
 * until they are confirmed. Do not invent them.
 */
export const PROJECT_DESCRIPTION_PLACEHOLDER =
  "A description of this edit has not been added yet.";

const notes = PROJECT_DESCRIPTION_PLACEHOLDER;

/**
 * Originals live in public/Details and are left untouched.
 * Web playback files are H.264 copies in public/media.
 */
export const projects: Project[] = [
  {
    slug: "cinematic-05",
    title: "Cinematic 05",
    category: "Cinematic",
    description:
      "Official trailer for NERAM by Nazeeb Billu ft. Laika Jamal, presented by Fift4collective. Edited to introduce the music video through carefully timed cuts, cinematic visuals, and a focused build-up.",
    thumbnail: "/media/cinematic/work-5.jpg",
    videoSrc: "/media/cinematic/work-5.mp4",
    featured: true,
    orientation: "landscape",
    layout: "feature",
    imageAlt: "Close portrait of a woman in dappled outdoor light",
  },
  {
    slug: "portrait-03",
    title: "Portrait 03",
    category: "Portrait",
    description: notes,
    thumbnail: "/media/portrait/work-3.jpg",
    videoSrc: "/media/portrait/work-3.mp4",
    featured: true,
    orientation: "portrait",
    layout: "vertical",
    imageAlt: "A concert crowd holding green lights",
  },
  {
    slug: "cinematic-03",
    title: "Cinematic 03",
    category: "Cinematic",
    description: notes,
    thumbnail: "/media/cinematic/work-3.jpg",
    videoSrc: "/media/cinematic/work-3.mp4",
    featured: true,
    orientation: "landscape",
    layout: "wide",
    imageAlt: "Black and white view down a forest path",
  },
  {
    slug: "cinematic-04",
    title: "Cinematic 04",
    category: "Cinematic",
    description: notes,
    thumbnail: "/media/cinematic/work-4.jpg",
    videoSrc: "/media/cinematic/work-4.mp4",
    featured: true,
    orientation: "landscape",
    layout: "standard",
    imageAlt: "White sedan parked on a paved courtyard",
  },
  {
    slug: "cinematic-02",
    title: "Cinematic 02",
    category: "Cinematic",
    description: notes,
    thumbnail: "/media/cinematic/work-2.jpg",
    videoSrc: "/media/cinematic/work-2.mp4",
    featured: true,
    orientation: "landscape",
    layout: "standard",
    imageAlt: "Black car filmed from above",
  },
  {
    slug: "cinematic-01",
    title: "Cinematic 01",
    category: "Cinematic",
    description:
      "A fast-paced automotive edit combining precise cuts, rhythmic pacing, and dynamic shot transitions to emphasize the car’s movement, details, and visual appeal.",
    thumbnail: "/media/cinematic/work-1.jpg",
    videoSrc: "/media/cinematic/work-1.mp4",
    featured: true,
    orientation: "landscape",
    layout: "wide",
    imageAlt: "A driver seen from the back seat of a moving car",
  },
  {
    slug: "portrait-02",
    title: "Portrait 02",
    category: "Portrait",
    description: notes,
    thumbnail: "/media/portrait/work-2.jpg",
    videoSrc: "/media/portrait/work-2.mp4",
    featured: true,
    orientation: "portrait",
    layout: "pair",
    imageAlt: "A fashion club sign against a bright sky",
  },
  {
    slug: "portrait-01",
    title: "Portrait 01",
    category: "Portrait",
    description: notes,
    thumbnail: "/media/portrait/work-1.jpg",
    videoSrc: "/media/portrait/work-1.mp4",
    featured: true,
    orientation: "portrait",
    layout: "pair",
    imageAlt: "Rear spoiler of a white car",
  },
];

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const seenSlugs = new Set<string>();

for (const project of projects) {
  if (!slugPattern.test(project.slug)) {
    throw new Error(`Invalid project slug: ${project.slug}`);
  }
  if (seenSlugs.has(project.slug)) {
    throw new Error(`Duplicate project slug: ${project.slug}`);
  }
  seenSlugs.add(project.slug);
}

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function projectNumber(slug: string) {
  const match = slug.match(/(\d+)$/);
  if (!match) return "01";
  return match[1].padStart(2, "0");
}

export function getNextProject(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index < 0 || projects.length < 2) return undefined;
  return projects[(index + 1) % projects.length];
}

export function getFeaturedProjects() {
  return projects.filter((project) => project.featured);
}

export function getRelatedProjects(slug: string, count = 3) {
  const current = getProject(slug);
  const others = projects.filter((project) => project.slug !== slug);
  if (!current) return others.slice(0, count);

  const sameCategory = others.filter(
    (project) => project.category === current.category,
  );
  const otherCategories = others.filter(
    (project) => project.category !== current.category,
  );

  return [...sameCategory, ...otherCategories].slice(0, count);
}

export function layoutClass(project: Project, editorial: boolean) {
  if (!editorial) return undefined;

  const layout =
    project.layout ??
    (project.orientation === "portrait" ? "vertical" : "standard");

  const spans: Record<ProjectLayout, string> = {
    feature: "lg:col-span-8",
    wide: "lg:col-span-7",
    standard: "lg:col-span-5",
    vertical: "lg:col-span-4",
    pair: "lg:col-span-6",
  };

  return spans[layout];
}
