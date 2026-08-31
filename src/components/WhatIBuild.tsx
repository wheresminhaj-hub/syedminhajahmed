import { useState } from "react";
import { WHAT_I_BUILD } from "@/data/portfolio";
import { Reveal, Section, SectionHeading } from "./ui-kit";
import { cn } from "@/lib/utils";

/** Lightweight SVG glyph per pillar — a subtle visual system, not decoration. */
function Glyph({ i, active }: { i: number; active: boolean }) {
  const stroke = active ? "var(--color-primary)" : "var(--color-muted-foreground)";
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14 transition-transform duration-500" aria-hidden
      style={{ transform: active ? "scale(1.08) rotate(-3deg)" : "none" }}>
      <g fill="none" stroke={stroke} strokeWidth="1.4" opacity="0.9">
        {i === 0 && (
          <>
            <circle cx="32" cy="32" r="18" />
            <circle cx="32" cy="32" r="5" fill={stroke} stroke="none" />
            <path d="M32 14v10M32 40v10M14 32h10M40 32h10" />
          </>
        )}
        {i === 1 && (
          <>
            <path d="M12 46l12-14 10 8 18-24" />
            <circle cx="24" cy="32" r="3" />
            <circle cx="34" cy="40" r="3" />
            <circle cx="52" cy="16" r="3" />
          </>
        )}
        {i === 2 && (
          <>
            <rect x="12" y="16" width="40" height="32" rx="4" />
            <path d="M22 30l-5 4 5 4M42 30l5 4-5 4M36 26l-8 16" />
          </>
        )}
        {i === 3 && (
          <>
            <path d="M32 12l18 10v20L32 52 14 42V22z" />
            <path d="M32 12v40M14 22l18 10 18-10" />
          </>
        )}
      </g>
    </svg>
  );
}

export function WhatIBuild() {
  const [active, setActive] = useState(0);

  return (
    <Section id="build">
      <SectionHeading
        meta="05 // Practice · What I care about"
        title="What I Build"
        subtitle="Think → Build → Solve."
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2">
        {WHAT_I_BUILD.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.06}>
            <button
              onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
              onClick={() => setActive(i)}
              aria-pressed={active === i}
              className={cn(
                "group flex h-full w-full items-start gap-5 rounded-3xl border p-6 text-left transition-all duration-500 sm:p-8",
                active === i
                  ? "border-primary/45 bg-surface/70"
                  : "border-border bg-surface/30 hover:border-border-strong",
              )}
            >
              <Glyph i={i} active={active === i} />
              <span>
                <span className="block font-display text-base font-semibold uppercase tracking-[0.08em] text-foreground">
                  {item.title}
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </span>
              </span>
            </button>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
