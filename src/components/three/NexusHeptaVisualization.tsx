import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Stage, type DragState } from "./Stage";
import { BLUE, CYAN, DIM, Edges, Lights, Node, Orbit, Packet, v } from "./shared";

/** DOCUMENT -> AI -> CLASSIFICATION -> VERIFICATION -> PROVENANCE */
function Doc({
  position,
  delay,
  reduced,
  onSelect,
}: {
  position: [number, number, number];
  delay: number;
  reduced: boolean;
  onSelect: (l: string | null) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (reduced || !ref.current) return;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.7 + delay) * 0.09;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4 + delay) * 0.05;
  });
  return (
    <group ref={ref} position={position} onPointerDown={() => onSelect("DOCUMENT")}>
      <mesh>
        <boxGeometry args={[0.86, 1.14, 0.035]} />
        <meshStandardMaterial color="#171D24" roughness={0.7} metalness={0.1} />
      </mesh>
      {[0.34, 0.14, -0.06, -0.26].map((y, i) => (
        <mesh key={i} position={[-0.06 + i * 0.02, y, 0.025]}>
          <planeGeometry args={[0.52 - i * 0.06, 0.045]} />
          <meshBasicMaterial color={i === 0 ? CYAN : DIM} transparent opacity={i === 0 ? 0.8 : 0.4} />
        </mesh>
      ))}
    </group>
  );
}

function Core({ reduced, quality }: { reduced: boolean; quality: "high" | "medium" | "low" }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, raw) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.y += Math.min(raw, 0.05) * 0.5;
    ref.current.rotation.x += Math.min(raw, 0.05) * 0.18;
  });
  return (
    <mesh ref={ref} position={[-0.4, 0, 0]}>
      <icosahedronGeometry args={[0.6, quality === "low" ? 0 : 1]} />
      <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.7} wireframe />
    </mesh>
  );
}

function Scene({
  drag,
  quality,
  reduced,
  onSelect,
}: {
  drag: React.MutableRefObject<DragState>;
  quality: "high" | "medium" | "low";
  reduced: boolean;
  onSelect: (l: string | null) => void;
}) {
  const docCount = quality === "high" ? 5 : quality === "medium" ? 4 : 3;
  const classCount = quality === "high" ? 4 : 3;

  const docs = useMemo(
    () =>
      Array.from({ length: docCount }, (_, i) => {
        const t = i / Math.max(1, docCount - 1);
        return [-3.5, (t - 0.5) * 2.9, (i % 2 ? 0.5 : -0.5)] as [number, number, number];
      }),
    [docCount],
  );

  const core = v(-0.4, 0, 0);
  const classes = useMemo(
    () =>
      Array.from({ length: classCount }, (_, i) =>
        v(1.5, ((i / Math.max(1, classCount - 1)) - 0.5) * 2.4, (i % 2 ? 0.45 : -0.45)),
      ),
    [classCount],
  );
  const verify = v(3.1, 0.75, 0);
  const provenance = useMemo(
    () => [v(3.55, -0.4, 0.3), v(4.1, -1.15, -0.1), v(4.6, -1.85, 0.25)],
    [],
  );

  const edges = useMemo<[THREE.Vector3, THREE.Vector3][]>(() => {
    const e: [THREE.Vector3, THREE.Vector3][] = [];
    docs.forEach((d) => e.push([v(d[0], d[1], d[2]), core]));
    classes.forEach((c) => {
      e.push([core, c]);
      e.push([c, verify]);
    });
    let prev = verify;
    provenance.forEach((p) => {
      e.push([prev, p]);
      prev = p;
    });
    // search relationships between classification nodes
    for (let i = 0; i < classes.length - 1; i++) e.push([classes[i]!, classes[i + 1]!]);
    return e;
  }, [docs, classes, provenance, core, verify]);

  const pipe = useMemo(
    () => [v(-3.5, 0, 0), core.clone(), v(1.5, 0.2, 0), verify.clone(), provenance[0]!.clone()],
    [core, verify, provenance],
  );

  return (
    <>
      <Lights quality={quality} />
      <Orbit drag={drag} reduced={reduced} spin={0.045}>
        <Edges points={edges} opacity={0.22} />
        {docs.map((d, i) => (
          <Doc key={i} position={d} delay={i} reduced={reduced} onSelect={onSelect} />
        ))}
        <Node
          position={[-3.5, 1.85, 0]}
          radius={0.09}
          label="COLLECT"
          reduced={reduced}
          onSelect={onSelect}
        />

        <Core reduced={reduced} quality={quality} />
        <Node
          position={[core.x, core.y, core.z]}
          radius={0.16}
          label="AI"
          pulse={1}
          reduced={reduced}
          onSelect={onSelect}
        />

        {classes.map((c, i) => (
          <Node
            key={i}
            position={[c.x, c.y, c.z]}
            radius={0.15}
            color={BLUE}
            detail={quality === "low" ? 0 : 1}
            pulse={i + 2}
            reduced={reduced}
            onSelect={onSelect}
            label={i === 0 ? "CLASSIFY" : undefined}
          />
        ))}

        <Node
          position={[verify.x, verify.y, verify.z]}
          radius={0.22}
          color={CYAN}
          label="VERIFY"
          pulse={3}
          reduced={reduced}
          onSelect={onSelect}
        />

        {provenance.map((p, i) => (
          <Node
            key={i}
            position={[p.x, p.y, p.z]}
            radius={0.12}
            color={i === provenance.length - 1 ? CYAN : DIM}
            emissive={0.8}
            detail={quality === "low" ? 0 : 1}
            reduced={reduced}
            onSelect={onSelect}
            label={i === provenance.length - 1 ? "PROVENANCE" : undefined}
          />
        ))}

        <Packet path={pipe} reduced={reduced} speed={0.16} />
        <Packet path={pipe} reduced={reduced} speed={0.16} offset={0.4} color={BLUE} />
        {quality !== "low" && (
          <Packet path={pipe} reduced={reduced} speed={0.16} offset={0.75} size={0.06} />
        )}
      </Orbit>
    </>
  );
}

export function NexusHeptaVisualization({ className }: { className?: string }) {
  return (
    <Stage
      label="Interactive 3D documentation infrastructure: collect, classify, verify, trace"
      className={className ?? "h-[340px] sm:h-[400px] lg:h-[480px]"}
      camera={[0.3, 0.4, 10.5]}
      fov={48}
    >
      {({ drag, quality, reduced, onSelect }) => (
        <Scene drag={drag} quality={quality} reduced={reduced} onSelect={onSelect} />
      )}
    </Stage>
  );
}
