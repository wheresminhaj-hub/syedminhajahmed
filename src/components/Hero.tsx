import { motion } from "framer-motion";
import { PERSON } from "@/data/portfolio";
import { scrollToSection, usePrefersReducedMotion } from "@/lib/use-device";
import { LazyKnowledgeGraph } from "./three/LazyViz";
import { ActionButton } from "./ui-kit";

const META = ["AI SYSTEM // ONLINE", "ML // ACTIVE", "BUILDING // 2026"];

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const anim = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      id="hero"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden px-5 pb-16 pt-28 sm:px-8 lg:px-12 lg:pt-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] opacity-60"
        style={{ background: "var(--gradient-edge)" }}
      />
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <motion.p {...anim(0)} className="mono-label flex items-center gap-3">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
            {PERSON.eyebrow}
          </motion.p>

          <motion.h1
            {...anim(0.08)}
            className="mt-6 text-[2.6rem] font-semibold leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
          >
            SYED
            <br />
            MINHAJ
            <br />
            <span className="text-muted-foreground">AHMED</span>
          </motion.h1>

          <motion.p
            {...anim(0.16)}
            className="mt-7 max-w-xl text-lg font-medium text-foreground sm:text-xl"
          >
            {PERSON.statement}
          </motion.p>

          <motion.p {...anim(0.22)} className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {PERSON.intro}
          </motion.p>

          <motion.div {...anim(0.3)} className="mt-9 flex flex-wrap gap-3">
            <ActionButton onClick={() => scrollToSection("projects")}>
              Explore Projects <span aria-hidden>↘</span>
            </ActionButton>
            <ActionButton variant="ghost" onClick={() => scrollToSection("contact")}>
              Let&apos;s Connect <span aria-hidden>↗</span>
            </ActionButton>
          </motion.div>

          <motion.ul {...anim(0.38)} className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
            {META.map((m) => (
              <li key={m} className="mono-label">
                {m}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div {...anim(0.2)}>
          <LazyKnowledgeGraph />
        </motion.div>
      </div>

      <button
        onClick={() => scrollToSection("about")}
        className="mx-auto mt-12 w-fit font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary lg:mt-16"
      >
        Scroll to explore ↓
      </button>
    </section>
  );
}
