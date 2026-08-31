import { Suspense, lazy } from "react";
import { useHydrated } from "@/lib/use-device";

const KnowledgeGraph = lazy(() =>
  import("./AIKnowledgeGraph").then((m) => ({ default: m.AIKnowledgeGraph })),
);
const NutriCode = lazy(() =>
  import("./NutriCodeVisualization").then((m) => ({ default: m.NutriCodeVisualization })),
);
const NexusHepta = lazy(() =>
  import("./NexusHeptaVisualization").then((m) => ({ default: m.NexusHeptaVisualization })),
);

function Skeleton({ className }: { className: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-surface/40 ${className}`}>
      <div className="flex h-full items-center justify-center">
        <span className="mono-label animate-pulse">INITIALISING 3D SYSTEM…</span>
      </div>
    </div>
  );
}

function Gate({ className, children }: { className: string; children: React.ReactNode }) {
  const hydrated = useHydrated();
  if (!hydrated) return <Skeleton className={className} />;
  return <Suspense fallback={<Skeleton className={className} />}>{children}</Suspense>;
}

export function LazyKnowledgeGraph({
  variant = "hero",
  className = "h-[360px] sm:h-[420px] lg:h-[560px]",
}: {
  variant?: "hero" | "about";
  className?: string;
}) {
  return (
    <Gate className={className}>
      <KnowledgeGraph variant={variant} className={className} />
    </Gate>
  );
}

export function LazyNutriCode({ className = "h-[340px] sm:h-[400px] lg:h-[480px]" }) {
  return (
    <Gate className={className}>
      <NutriCode className={className} />
    </Gate>
  );
}

export function LazyNexusHepta({ className = "h-[340px] sm:h-[400px] lg:h-[480px]" }) {
  return (
    <Gate className={className}>
      <NexusHepta className={className} />
    </Gate>
  );
}
