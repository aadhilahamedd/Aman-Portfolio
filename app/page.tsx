import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";
import { Hero } from "@/components/home/Hero";
import { SelectedWorks } from "@/components/home/SelectedWorks";
import { Showreel } from "@/components/home/Showreel";
import { SocialImage } from "@/components/seo/SocialImage";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { getFeaturedProjects } from "@/data/projects";
import { site } from "@/data/site";
import { assertPublicFiles } from "@/lib/assets";

export default function Home() {
  const projects = getFeaturedProjects();

  assertPublicFiles([
    site.hero.image,
    site.hero.video,
    site.portrait.image,
    site.showreel.poster,
    site.showreel.src,
    ...projects.flatMap((project) => [project.thumbnail, project.videoSrc]),
  ]);

  return (
    <>
      <SocialImage src={site.hero.image} alt={site.hero.alt} />
      <Hero />
      <Showreel />
      <section id="work" className="shade-work pb-24 pt-8 md:pb-32">
        <Container>
          <Reveal>
            <div className="mb-8 text-center md:mb-12">
              <h2 className="font-display text-[clamp(1.6rem,4vw,2.4rem)] uppercase tracking-[0.12em] text-ink">
                Selected Works
              </h2>
              <span className="mx-auto mt-4 block h-0.5 w-14 bg-accent" />
            </div>
          </Reveal>
          <SelectedWorks projects={projects} />
        </Container>
      </section>
      <About />
      <Contact />
    </>
  );
}
