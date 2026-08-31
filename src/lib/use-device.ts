import { useEffect, useState } from "react";

export type Quality = "high" | "medium" | "low";

export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}

/** Adaptive 3D quality tier — never disables 3D, only scales it. */
export function useQuality(): Quality {
  const [q, setQ] = useState<Quality>("medium");
  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const mem = nav.deviceMemory ?? 4;
    const cores = navigator.hardwareConcurrency ?? 4;
    const w = window.innerWidth;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let tier: Quality = "high";
    if (coarse || w < 1024) tier = "medium";
    if (mem <= 2 || cores <= 4 || w < 400) tier = "low";
    if (!coarse && w >= 1280 && cores >= 8 && mem >= 8) tier = "high";
    setQ(tier);
  }, []);
  return q;
}

export function useIsTouch() {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setTouch(mq.matches || "ontouchstart" in window);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return touch;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** True while the element is (near) the viewport — used to pause offscreen 3D. */
export function useInView<T extends HTMLElement>(ref: React.RefObject<T | null>, margin = "200px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => setInView(entries[0]!.isIntersecting), {
      rootMargin: margin,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return inView;
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}
