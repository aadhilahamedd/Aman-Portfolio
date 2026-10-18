import type { Project } from "@/data/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <li key={project.slug} className="min-w-0">
          <ProjectCard project={project} delay={Math.min(index * 0.07, 0.28)} />
        </li>
      ))}
    </ul>
  );
}
