import { CONTACT, LINKS, PERSON } from "@/data/portfolio";
import { ActionLink, Reveal, Section } from "./ui-kit";

export function Contact() {
  return (
    <Section id="contact" className="border-t border-border">
      <div className="flex flex-col items-start gap-10">
        <Reveal className="max-w-3xl">
          <p className="mono-label flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-primary" />
            CONTACT
          </p>
          <h2 className="mt-5 text-3xl font-semibold leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
            {CONTACT.heading}
          </h2>
          <p className="mt-5 text-base text-muted-foreground sm:text-lg">{CONTACT.support}</p>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-wrap gap-3">
          <ActionLink href={`mailto:${LINKS.YOUR_EMAIL}`} variant="primary" external={false}>
            Email me
          </ActionLink>
          <ActionLink href={LINKS.YOUR_GITHUB_URL}>GitHub</ActionLink>
          <ActionLink href={LINKS.YOUR_LINKEDIN_URL}>LinkedIn</ActionLink>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mono-label">{PERSON.focus}</p>
        </Reveal>
      </div>
    </Section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="mono-label">{PERSON.shortMark}</p>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {PERSON.name}. {PERSON.statement}
        </p>
      </div>
    </footer>
  );
}
