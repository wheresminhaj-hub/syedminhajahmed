import { useMemo } from "react";
import * as THREE from "three";
import { Stage } from "./Stage";
import { BLUE, CYAN, Edges, Lights, Motes, Node, Orbit, Packet, v } from "./shared";

type Variant = "hero" | "about";

const ABOUT_LABELS = ["AI", "ML", "SOFTWARE", "PROBLEM SOLVING"];

function Graph({
  drag,
  quality,
  reduced,
  onSelect,
  variant,
}: {
  drag: React.MutableRefObject<import("./Stage").DragState>;
  quality: "high" | "medium" | "low";
  reduced: boolean;
  onSelect: (l: string | null) => void;
  variant: Variant;
}) {
  const layers = useMemo(() => {
    const perLayer =
      variant === "about"
        ? { high: [4, 5, 4, 3], medium: [3, 4, 3, 2], low: [3, 3, 2, 2] }[quality]
        : { high: [4, 6, 6, 4], medium: [3, 5, 4, 3], low: [3, 3, 3, 2] }[quality];

    const cols: THREE.Vector3[][] = [];
    const spread = variant === "about" ? 2.4 : 3.1;
    perLayer.forEach((n, li) => {
      const x = (li - (perLayer.length - 1) / 2) * (spread * 0.85);
      const col: THREE.Vector3[] = [];
      for (let i = 0; i < n; i++) {
        const y = (i - (n - 1) / 2) * 1.15;
        const z = ((i % 3) - 1) * 0.9 + (li % 2 ? 0.4 : -0.4);
        col.push(v(x, y, z));
      }
      cols.push(col);
    });
    return cols;
  }, [quality, variant]);

  const edges = useMemo(() => {
    const out: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < layers.length - 1; i++) {
      layers[i]!.forEach((a, ai) => {
        layers[i + 1]!.forEach((b, bi) => {
          if ((ai + bi) % 2 === 0 || quality === "high") out.push([a, b]);
        });
      });
    }
    return out;
  }, [layers, quality]);

  const paths = useMemo(() => {
    const res: THREE.Vector3[][] = [];
    const count = quality === "high" ? 4 : quality === "medium" ? 3 : 2;
    for (let i = 0; i < count; i++) {
      res.push(layers.map((col) => col[(i + col.length) % col.length]!.clone()));
    }
    return res;
  }, [layers, quality]);

  const labelled = variant === "about" ? ABOUT_LABELS : ["INPUT", "EMBED", "REASON", "OUTPUT"];

  return (
    <>
      <Lights quality={quality} />
      <Orbit drag={drag} reduced={reduced} spin={variant === "about" ? 0.09 : 0.05}>
        <Edges points={edges} opacity={quality === "low" ? 0.18 : 0.24} />
        {layers.map((col, li) =>
          col.map((p, i) => (
            <Node
              key={`${li}-${i}`}
              position={[p.x, p.y, p.z]}
              radius={i === 0 && li % 2 === 0 ? 0.19 : 0.14}
              color={li % 2 === 0 ? CYAN : BLUE}
              emissive={1.1}
              detail={quality === "low" ? 0 : 1}
              pulse={li + i}
              reduced={reduced}
              onSelect={onSelect}
              label={i === Math.floor(col.length / 2) ? labelled[li] : undefined}
            />
          )),
        )}
        {paths.map((p, i) => (
          <Packet key={i} path={p} offset={i / paths.length} reduced={reduced} speed={0.18} />
        ))}
        {quality !== "low" && <Motes count={quality === "high" ? 90 : 45} reduced={reduced} />}
      </Orbit>
    </>
  );
}

export function AIKnowledgeGraph({
  variant = "hero",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  return (
    <Stage
      label={
        variant === "about"
          ? "Interactive 3D knowledge network of AI, ML, software and problem solving"
          : "Interactive 3D AI knowledge graph"
      }
      className={className ?? "h-[360px] sm:h-[420px] lg:h-[560px]"}
      camera={[0, 0, variant === "about" ? 8 : 9]}
    >
      {({ drag, quality, reduced, onSelect }) => (
        <Graph
          drag={drag}
          quality={quality}
          reduced={reduced}
          onSelect={onSelect}
          variant={variant}
        />
      )}
    </Stage>
  );
}
