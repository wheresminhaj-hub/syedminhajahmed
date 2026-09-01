import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { PERSON } from "@/data/portfolio";

const SESSION_KEY = "sma-intro-played";

/**
 * Full-screen animated intro: mark reveal → statement wipe → curtain lift.
 * Plays once per browser session and respects reduced-motion.
 */
export function IntroSequence() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let played = false;
    try {
      played = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      played = false;
    }
    if (played || reduced) {
      setPhase("done");
      return;
    }
    setPhase("playing");
    document.body.style.overflow = "hidden";

    const total = 2400;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / total);
      setProgress(Math.round(t * 100));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      setPhase("done");
      document.body.style.overflow = "";
    }, total + 350);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {phase === "playing" && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ambient accent glow */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute h-[60vmin] w-[60vmin] rounded-full blur-[100px]"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--color-primary) 45%, transparent), transparent 70%)",
            }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 0.7, 0.35], scale: [0.6, 1.05, 1] }}
            transition={{ duration: 2.2, ease: "easeOut" }}
          />

          <div className="relative flex flex-col items-center gap-6 px-6 text-center">
            <motion.span
              className="mono-label text-muted-foreground"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              INITIALISING SYSTEM
            </motion.span>

            <div className="overflow-hidden">
              <motion.h1
                className="text-3xl font-semibold tracking-tight sm:text-5xl"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                {PERSON.name}
              </motion.h1>
            </div>

            <motion.p
              className="max-w-md text-xs leading-relaxed tracking-[0.18em] text-muted-foreground sm:text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              {PERSON.statement}
            </motion.p>

            {/* progress rail */}
            <div className="mt-4 flex w-56 items-center gap-3 sm:w-72">
              <div className="h-px flex-1 overflow-hidden bg-border">
                <motion.div
                  className="h-full w-full origin-left bg-primary"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 2.4, ease: [0.4, 0, 0.1, 1] }}
                />
              </div>
              <span className="mono-label w-10 text-right text-muted-foreground tabular-nums">
                {String(progress).padStart(3, "0")}
              </span>
            </div>
          </div>

          {/* curtain lift */}
          <motion.div
            aria-hidden
            className="absolute inset-0 origin-bottom bg-background"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 0 }}
            exit={{ scaleY: 1 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
