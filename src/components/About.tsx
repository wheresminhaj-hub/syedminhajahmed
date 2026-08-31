import { ABOUT, PERSON } from "@/data/portfolio";
import { ProfileCard } from "./ProfileCard";
import { LazyKnowledgeGraph } from "./three/LazyViz";
import { Reveal, Section, SectionHeading, Tag } from "./ui-kit";

export function About() {
  return (
    <Section id="about">
      <SectionHeading meta="01 // About · How I think" title={ABOUT.heading} />

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          {ABOUT.paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="mb-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {p}
              </p>
            </Reveal>
          ))}

          <Reveal delay={0.16}>
            <div className="mt-6 flex flex-wrap gap-2">
              {PERSON.positioning.map((p) => (
                <Tag key={p}>{p}</Tag>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="mt-10">
              <p className="mono-label mb-3">Knowledge Network // Interactive</p>
              <LazyKnowledgeGraph variant="about" className="h-[320px] sm:h-[380px] lg:h-[420px]" />
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <ProfileCard />
        </Reveal>
      </div>
    </Section>
  );
}
