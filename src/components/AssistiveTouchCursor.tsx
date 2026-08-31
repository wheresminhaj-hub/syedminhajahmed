import { useEffect, useRef, useState } from "react";
import { useIsTouch, usePrefersReducedMotion } from "@/lib/use-device";

type Mode = "idle" | "button" | "view" | "interact";

const LABEL: Record<Mode, string> = {
  idle: "",
  button: "",
  view: "VIEW",
  interact: "INTERACT",
};

const SIZE: Record<Mode, number> = { idle: 26, button: 40, view: 66, interact: 74 };

/** Apple AssistiveTouch-inspired floating cursor. Desktop / fine-pointer only. */
export function AssistiveTouchCursor() {
  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("idle");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isTouch) return;
    document.documentElement.classList.add("cursor-hidden");
    return () => document.documentElement.classList.remove("cursor-hidden");
  }, [isTouch]);

  useEffect(() => {
    if (isTouch) return;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = e.clientX;
      target.y = e.clientY;
      setVisible(true);
      const el = e.target as HTMLElement | null;
      const hit = el?.closest?.("[data-cursor]") as HTMLElement | null;
      const attr = hit?.dataset.cursor as Mode | undefined;
      if (attr) setMode(attr);
      else if (el?.closest("a, button, input, textarea, [role='button']")) setMode("button");
      else setMode("idle");
    };

    const loop = () => {
      const k = reduced ? 1 : 0.18;
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };

    const onLeave = () => setVisible(false);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [isTouch, reduced]);

  if (isTouch) return null;

  const size = SIZE[mode];

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[999] hidden md:block"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 240ms ease" }}
    >
      <div
        className="flex items-center justify-center rounded-full border backdrop-blur-md"
        style={{
          width: size,
          height: size,
          borderColor:
            mode === "idle"
              ? "color-mix(in oklab, var(--color-foreground) 45%, transparent)"
              : "color-mix(in oklab, var(--color-primary) 85%, transparent)",
          background:
            mode === "idle"
              ? "color-mix(in oklab, var(--color-background) 55%, transparent)"
              : "color-mix(in oklab, var(--color-primary) 12%, transparent)",
          boxShadow: "0 6px 22px -8px oklch(0 0 0 / 0.9)",
          transition: "width 320ms cubic-bezier(.22,1,.36,1), height 320ms cubic-bezier(.22,1,.36,1), background 300ms, border-color 300ms",
        }}
      >
        {LABEL[mode] ? (
          <span
            className="font-mono text-[9px] tracking-[0.18em] text-primary"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {LABEL[mode]}
          </span>
        ) : (
          <span
            className="rounded-full bg-foreground"
            style={{ width: mode === "button" ? 8 : 5, height: mode === "button" ? 8 : 5, opacity: 0.85, transition: "all 300ms" }}
          />
        )}
      </div>
    </div>
  );
}
