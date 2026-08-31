import { Canvas } from "@react-three/fiber";
import {
  Suspense,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useInView, usePrefersReducedMotion, useQuality, type Quality } from "@/lib/use-device";

export type DragState = {
  /** target rotation applied by the user */
  x: number;
  y: number;
  /** pointer position normalised -1..1, desktop hover parallax */
  px: number;
  py: number;
  active: boolean;
};

export type StageRender = (ctx: {
  drag: React.MutableRefObject<DragState>;
  quality: Quality;
  reduced: boolean;
  active: boolean;
  onSelect: (label: string | null) => void;
}) => ReactNode;

type Props = {
  children: StageRender;
  className?: string;
  camera?: [number, number, number];
  fov?: number;
  label: string;
  /** small caption shown under the canvas when a node is tapped */
  showSelection?: boolean;
};

const DPR: Record<Quality, [number, number]> = {
  high: [1, 2],
  medium: [1, 1.5],
  low: [0.75, 1],
};

export function Stage({
  children,
  className = "",
  camera = [0, 0, 9],
  fov = 50,
  label,
  showSelection = true,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const inView = useInView(hostRef);
  const quality = useQuality();
  const reduced = usePrefersReducedMotion();
  const [selected, setSelected] = useState<string | null>(null);

  const drag = useRef<DragState>({ x: 0, y: 0, px: 0, py: 0, active: false });
  const last = useRef<{ x: number; y: number } | null>(null);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    last.current = { x: e.clientX, y: e.clientY };
    drag.current.active = true;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const host = e.currentTarget as HTMLElement;
    const r = host.getBoundingClientRect();
    drag.current.px = ((e.clientX - r.left) / r.width) * 2 - 1;
    drag.current.py = ((e.clientY - r.top) / r.height) * 2 - 1;
    if (!last.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    drag.current.y += dx * 0.006;
    drag.current.x = Math.max(-0.9, Math.min(0.9, drag.current.x + dy * 0.004));
  }, []);

  const endDrag = useCallback(() => {
    last.current = null;
    drag.current.active = false;
  }, []);

  const gl = useMemo(
    () => ({ antialias: quality !== "low", powerPreference: "high-performance" as const }),
    [quality],
  );

  return (
    <div className="relative">
      <div
        ref={hostRef}
        role="img"
        aria-label={label}
        className={`relative overflow-hidden rounded-2xl border border-border bg-surface/40 ${className}`}
        style={{ touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        data-cursor="interact"
      >
        {inView ? (
          <Canvas
            dpr={DPR[quality]}
            gl={gl}
            frameloop={inView ? "always" : "demand"}
            camera={{ position: camera, fov }}
          >
            <Suspense fallback={null}>
              {children({ drag, quality, reduced, active: inView, onSelect: setSelected })}
            </Suspense>
          </Canvas>
        ) : null}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-border" />
      </div>
      {showSelection && (
        <p className="mono-label mt-3 min-h-4">
          {selected ? `SELECTED // ${selected}` : "DRAG TO ROTATE // TAP A NODE"}
        </p>
      )}
    </div>
  );
}
