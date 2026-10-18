import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseHeader, CaseMedia } from "@/components/projects/CaseStudy";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { ProjectVideo } from "@/components/projects/ProjectVideo";
import { Container } from "@/components/ui/Container";
import {
  PROJECT_DESCRIPTION_PLACEHOLDER,
  getNextProject,
  getProject,
  getRelatedProjects,
  projectNumber,
  projects,
} from "@/data/projects";
import { SocialImage } from "@/components/seo/SocialImage";
import { site } from "@/data/site";
import { assertPublicFiles } from "@/lib/assets";
import { productionOrigin } from "@/lib/site-url";

export const dynamicParams = false;

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return { title: "Page not found" };
  }

  const description =
    project.description === PROJECT_DESCRIPTION_PLACEHOLDER
      ? `${project.category} edit by ${site.name}.`
      : project.description;
  const origin = productionOrigin();

  return {
    title: project.title,
    description,
    ...(origin ? { alternates: { canonical: `/work/${project.slug}` } } : {}),
    openGraph: {
      title: `${project.title} — ${site.name}`,
      description,
      type: "article",
      ...(origin
        ? { images: [{ url: project.thumbnail, alt: project.imageAlt }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — ${site.name}`,
      description,
      ...(origin ? { images: [project.thumbnail] } : {}),
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  assertPublicFiles([project.thumbnail, project.videoSrc]);

  const descriptionNeeded =
    project.description === PROJECT_DESCRIPTION_PLACEHOLDER;
  const related = getRelatedProjects(project.slug).filter(
    (item) => item.slug !== getNextProject(project.slug)?.slug,
  );
  const next = getNextProject(project.slug);
  const number = projectNumber(project.slug);
  const total = String(projects.length).padStart(2, "0");

  return (
    <article className="shade-case pb-24 pt-28 md:pb-32 md:pt-36">
      <Container>
        <Link
          href="/#work"
          className="inline-flex min-h-11 items-center text-[0.72rem] uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
        >
          All work
        </Link>
        <div className="mt-10">
          <CaseHeader
            number={number}
            total={total}
            title={project.title}
            category={project.category}
            year={project.year}
          />
        </div>
        <SocialImage src={project.thumbnail} alt={project.imageAlt} />
        <CaseMedia>
          <ProjectVideo
            src={project.videoSrc}
            embedUrl={project.videoEmbedUrl}
            poster={project.thumbnail}
            title={project.title}
            orientation={project.orientation}
            playLabel="Play film"
          />
        </CaseMedia>

        <p
          className={`mt-10 max-w-2xl text-lg leading-relaxed ${
            descriptionNeeded ? "italic text-muted" : "text-ink/90"
          }`}
        >
          {project.description}
        </p>

        {project.credits && project.credits.length > 0 ? (
          <dl className="mt-10 grid max-w-2xl gap-4 border-t border-line pt-8 sm:grid-cols-2">
            {project.credits.map((credit) => (
              <div key={`${credit.role}-${credit.name}`}>
                <dt className="text-[0.72rem] uppercase tracking-[0.16em] text-muted">
                  {credit.role}
                </dt>
                <dd className="mt-1 text-ink">{credit.name}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {next ? (
          <section className="mt-24 border-t border-line pt-10" aria-labelledby="next-film-heading">
            <p className="text-[0.72rem] uppercase tracking-[0.16em] text-muted">Next film</p>
            <h2 id="next-film-heading" className="mt-3 font-display text-[clamp(2.2rem,4vw,3.8rem)] leading-none text-ink">
              <Link href={`/work/${next.slug}`} className="transition-colors hover:text-accent">
                {next.title}
                <span aria-hidden="true"> →</span>
              </Link>
            </h2>
            <p className="mt-3 text-[0.72rem] uppercase tracking-[0.16em] text-accent">
              {next.category}
            </p>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section className="mt-20" aria-labelledby="more-work-heading">
            <h2
              id="more-work-heading"
              className="mb-10 font-display text-[clamp(2rem,4vw,3rem)] leading-none text-ink"
            >
              More work
            </h2>
            <ProjectGrid projects={related.slice(0, 2)} />
          </section>
        ) : null}
      </Container>
    </article>
  );
}
