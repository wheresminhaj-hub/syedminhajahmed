import { useState } from "react";
import { SKILL_GROUPS } from "@/data/portfolio";
import { Reveal, Section, SectionHeading } from "./ui-kit";
import { cn } from "@/lib/utils";

type Active = { name: string; note: string } | null;

export function Skills() {
  const [active, setActive] = useState<Active>(null);

  return (
    <Section id="skills">
      <SectionHeading
        meta="03 // Skills · What I work with"
        title="Technical Toolkit"
        subtitle="A connected constellation of languages, intelligence and engineering. Hover or tap a node."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {SKILL_GROUPS.map((group, gi) => (
          <Reveal key={group.group} delay={gi * 0.08}>
            <div className="panel relative h-full overflow-hidden p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground">{group.group}</h3>
                <span className="mono-label">0{gi + 1}</span>
              </div>

              {/* constellation */}
              <div className="relative mt-8 h-[220px]">
                <svg
                  aria-hidden
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 300 220"
                  preserveAspectRatio="none"
                >
                  {group.items.map((_, i) => {
                    if (i === group.items.length - 1) return null;
                    const a = nodePos(i, group.items.length);
                    const b = nodePos(i + 1, group.items.length);
                    return (
                      <line
                        key={i}
                        x1={a.x * 3}
                        y1={a.y * 2.2}
                        x2={b.x * 3}
                        y2={b.y * 2.2}
                        stroke="currentColor"
                        className="text-primary/25"
                        strokeWidth="1"
                      />
                    );
                  })}
                </svg>

                {group.items.map((item, i) => {
                  const p = nodePos(i, group.items.length);
                  const isActive = active?.name === item.name;
                  return (
                    <button
                      key={item.name}
                      onPointerEnter={(e) =>
                        e.pointerType === "mouse" && setActive({ name: item.name, note: item.note })
                      }
                      onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
                      onClick={() =>
                        setActive(isActive ? null : { name: item.name, note: item.note })
                      }
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                      className={cn(
                        "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-all duration-300",
                        isActive
                          ? "scale-105 border-primary bg-primary/15 text-primary"
                          : "border-border bg-background/70 text-muted-foreground hover:border-primary/50 hover:text-foreground",
                      )}
                      aria-pressed={isActive}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>

              <p className="mt-4 min-h-10 border-t border-border pt-4 text-sm text-muted-foreground">
                {group.items.some((i) => i.name === active?.name)
                  ? active?.note
                  : "Select a node to read more."}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function nodePos(i: number, total: number) {
  const t = total <= 1 ? 0.5 : i / (total - 1);
  return {
    x: 26 + Math.sin(t * Math.PI * 1.35) * 46,
    y: 10 + t * 80,
  };
}
