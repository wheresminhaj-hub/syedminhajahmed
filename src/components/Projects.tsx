import { useState } from "react";
import { PROJECTS, type Project } from "@/data/portfolio";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";
import { Section, SectionHeading } from "./ui-kit";

export function Projects() {
  const [open, setOpen] = useState<Project | null>(null);

  return (
    <Section id="projects">
      <SectionHeading
        meta="02 // Projects · What I build"
        title="Selected Work"
        subtitle="Ideas engineered into practical systems."
      />

      <div className="mt-14 space-y-10 lg:mt-20 lg:space-y-16">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.id} project={p} reversed={i % 2 === 1} onOpen={() => setOpen(p)} />
        ))}
      </div>

      <ProjectModal project={open} onClose={() => setOpen(null)} />
    </Section>
  );
}
