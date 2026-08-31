import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Project } from "@/data/portfolio";
import { LazyNexusHepta, LazyNutriCode } from "./three/LazyViz";
import { ActionLink, Tag } from "./ui-kit";

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border pt-6">
      <h3 className="mono-label">{title}</h3>
      <div className="mt-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

export function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    requestAnimationFrame(() => panelRef.current?.querySelector("button")?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prevFocus?.focus?.();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto overscroll-contain bg-background/85 p-3 backdrop-blur-md sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} case study`}
            initial={{ opacity: 0, y: 28, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.985 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="my-4 w-full max-w-4xl rounded-3xl border border-border bg-surface elevated"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 rounded-t-3xl border-b border-border bg-surface/95 px-5 py-4 backdrop-blur-xl sm:px-8">
              <div>
                <p className="mono-label">{project.label}</p>
                <h2 className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">
                  {project.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{project.subtitle}</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close project"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
              <div>
                {project.id === "nutricode" ? (
                  <LazyNutriCode className="h-[300px] sm:h-[380px]" />
                ) : (
                  <LazyNexusHepta className="h-[300px] sm:h-[380px]" />
                )}
              </div>

              <Block title="Overview">{project.overview}</Block>
              <Block title="Problem">{project.problem}</Block>
              <Block title="Solution">{project.solution}</Block>

              <Block title="How it works">
                <div className="flex flex-wrap items-center gap-2">
                  {project.howItWorks.map((s, i) => (
                    <span key={s} className="flex items-center gap-2">
                      <span className="rounded-lg border border-primary/35 bg-primary/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                        {s}
                      </span>
                      {i < project.howItWorks.length - 1 && (
                        <span className="text-muted-foreground" aria-hidden>
                          →
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </Block>

              <Block title="Workflow">
                <ol className="space-y-3">
                  {project.workflow.map((w, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="font-mono text-[11px] text-primary">0{i + 1}</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ol>
              </Block>

              {project.useCases && (
                <Block title="Use cases">
                  <div className="flex flex-wrap gap-2">
                    {project.useCases.map((u) => (
                      <Tag key={u}>{u}</Tag>
                    ))}
                  </div>
                </Block>
              )}

              {project.concepts && (
                <Block title="Key concepts">
                  <div className="flex flex-wrap gap-2">
                    {project.concepts.map((c) => (
                      <Tag key={c}>{c}</Tag>
                    ))}
                  </div>
                </Block>
              )}

              <Block title="Features">
                <ul className="grid gap-2 sm:grid-cols-2">
                  {project.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Block>

              <Block title="Technology">
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </Block>

              {project.disclaimer && (
                <p className="rounded-xl border border-border bg-background/60 p-4 font-mono text-[11px] leading-relaxed text-muted-foreground">
                  {project.disclaimer}
                </p>
              )}

              <Block title="Project links">
                {project.url ? (
                  <ActionLink href={project.url} variant="primary">
                    Open {project.title} ↗
                  </ActionLink>
                ) : (
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em]">
                    Link not published yet
                  </p>
                )}
              </Block>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
