import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Project } from "@/data/portfolio";
import { useIsTouch, usePrefersReducedMotion } from "@/lib/use-device";
import { LazyNexusHepta, LazyNutriCode } from "./three/LazyViz";
import { ActionButton, Reveal, Tag } from "./ui-kit";

export function ProjectCard({
  project,
  reversed,
  onOpen,
}: {
  project: Project;
  reversed?: boolean;
  onOpen: () => void;
}) {
  const reduced = usePrefersReducedMotion();
  const isTouch = useIsTouch();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [3, -3]), { stiffness: 180, damping: 22 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-3, 3]), { stiffness: 180, damping: 22 });

  const tilt = !reduced && !isTouch;

  return (
    <Reveal>
      <motion.article
        onPointerMove={(e) => {
          if (!tilt) return;
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        {...(tilt
          ? {
              style: { rotateX: rx, rotateY: ry, transformPerspective: 1200 },
              whileHover: { y: -6 },
            }
          : {})}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="group relative grid gap-8 rounded-3xl border border-border bg-surface/40 p-5 transition-colors duration-500 hover:border-primary/40 sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10"
      >
        <div className={reversed ? "lg:order-2" : ""}>
          <div className="flex items-baseline gap-4">
            <span className="font-display text-5xl font-semibold text-border-strong transition-colors duration-500 group-hover:text-primary sm:text-6xl">
              {project.index}
            </span>
            <span className="mono-label">{project.label}</span>
          </div>

          <h3 className="mt-6 text-3xl font-semibold text-foreground sm:text-4xl">
            {project.title}
          </h3>
          <p className="mt-2 text-lg text-primary">{project.subtitle}</p>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {project.description}
          </p>

          <div className="mt-7">
            <p className="mono-label">
              {project.id === "nutricode" ? "How it works" : "Workflow"}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {project.howItWorks.map((s, i) => (
                <span key={s} className="flex items-center gap-2">
                  <span className="rounded-lg border border-border bg-background/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground">
                    {s}
                  </span>
                  {i < project.howItWorks.length - 1 && (
                    <span className="text-primary" aria-hidden>
                      →
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-7">
            <p className="mono-label">Highlights</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {project.features.slice(0, 6).map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>

          {project.disclaimer && (
            <p className="mt-6 rounded-xl border border-border bg-background/60 p-4 font-mono text-[10px] leading-relaxed text-muted-foreground">
              {project.disclaimer}
            </p>
          )}

          <div className="mt-8" data-cursor="view">
            <ActionButton onClick={onOpen} aria-label={`View ${project.title} case study`}>
              View Project <span aria-hidden>↗</span>
            </ActionButton>
          </div>
        </div>

        <div className={reversed ? "lg:order-1" : ""}>
          {project.id === "nutricode" ? <LazyNutriCode /> : <LazyNexusHepta />}
        </div>
      </motion.article>
    </Reveal>
  );
}
