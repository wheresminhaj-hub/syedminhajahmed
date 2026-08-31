import { EDUCATION } from "@/data/portfolio";
import { Reveal, Section, SectionHeading } from "./ui-kit";

export function EducationTimeline() {
  return (
    <Section id="education">
      <SectionHeading
        meta="04 // Education · Where I'm learning"
        title="Academic Track"
        subtitle="An ongoing journey through computer science and machine learning."
      />

      <div className="relative mt-14 pl-8 sm:pl-12">
        <span
          aria-hidden
          className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-primary/70 via-border to-transparent sm:left-[11px]"
        />
        {EDUCATION.map((e, i) => (
          <Reveal key={e.institution} delay={i * 0.08}>
            <div className="relative pb-10">
              <span
                aria-hidden
                className="absolute -left-8 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-primary/60 bg-background sm:-left-12"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              <p className="mono-label">Current stage // {e.stage}</p>
              <h3 className="mt-3 text-xl font-semibold uppercase tracking-tight text-foreground sm:text-2xl">
                {e.institution}
              </h3>
              <p className="mt-1 text-base text-primary">{e.program}</p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {e.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
