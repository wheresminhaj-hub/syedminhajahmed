import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Stage, type DragState } from "./Stage";
import { BLUE, CYAN, DIM, Edges, Lights, Node, Orbit, Packet, v } from "./shared";

/**
 * NutriCode: SCAN -> ANALYZE -> UNDERSTAND -> CHOOSE
 * package + barcode + scan beam + data flow + ingredient/additive nodes +
 * concern indicators + health rating + dietary compatibility + alternatives.
 */
function ScanBeam({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    const t = reduced ? 0 : state.clock.elapsedTime;
    m.position.y = Math.sin(t * 1.4) * 0.62;
  });
  return (
    <mesh ref={ref} position={[-3.1, 0, 0.42]}>
      <planeGeometry args={[1.7, 0.035]} />
      <meshBasicMaterial color={CYAN} transparent opacity={0.9} />
    </mesh>
  );
}

function Barcode() {
  const bars = useMemo(
    () => Array.from({ length: 14 }, (_, i) => ({ x: -0.7 + i * 0.105, w: 0.02 + (i % 3) * 0.018 })),
    [],
  );
  return (
    <group position={[-3.1, 0, 0.38]}>
      <mesh>
        <planeGeometry args={[1.7, 1.0]} />
        <meshStandardMaterial color="#0E1216" roughness={0.9} />
      </mesh>
      {bars.map((b, i) => (
        <mesh key={i} position={[b.x, 0, 0.01]}>
          <planeGeometry args={[b.w, 0.72]} />
          <meshBasicMaterial color="#F2F5F3" />
        </mesh>
      ))}
    </group>
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
  const count = quality === "high" ? 6 : quality === "medium" ? 4 : 3;

  const ingredients = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2;
        return v(0.15 + Math.cos(a) * 1.25, Math.sin(a) * 1.25, Math.sin(a * 2) * 0.5);
      }),
    [count],
  );

  const scanCenter = v(-3.1, 0, 0.4);
  const hub = v(0.15, 0, 0);
  const rating = v(3.15, 0.85, 0);
  const dietary = v(3.15, -0.35, 0.4);
  const alternatives = v(3.15, -1.5, -0.2);

  const edges = useMemo<[THREE.Vector3, THREE.Vector3][]>(() => {
    const e: [THREE.Vector3, THREE.Vector3][] = [[scanCenter, hub]];
    ingredients.forEach((p) => e.push([hub, p]));
    e.push([hub, rating], [hub, dietary], [hub, alternatives]);
    return e;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ingredients]);

  const flow = useMemo(() => [scanCenter.clone(), v(-1.6, 0.4, 0.2), hub.clone()], []);
  const outFlow = useMemo(() => [hub.clone(), v(1.7, 0.5, 0.2), rating.clone()], []);

  return (
    <>
      <Lights quality={quality} />
      <Orbit drag={drag} reduced={reduced} spin={0.04}>
        {/* STEP 1 — stylized food package */}
        <mesh position={[-3.1, 0, -0.35]} onPointerDown={() => onSelect("FOOD PRODUCT")}>
          <boxGeometry args={[2.1, 2.9, 0.7]} />
          <meshStandardMaterial color="#141A20" roughness={0.6} metalness={0.15} />
        </mesh>
        <mesh position={[-3.1, 1.15, 0.02]}>
          <planeGeometry args={[1.4, 0.16]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.55} />
        </mesh>
        {/* STEP 2 + 3 — barcode and scanning */}
        <Barcode />
        {!reduced && <ScanBeam reduced={reduced} />}

        {/* STEP 4 — data flowing from barcode */}
        <Edges points={edges} opacity={0.26} />
        <Packet path={flow} reduced={reduced} speed={0.5} />
        <Packet path={flow} reduced={reduced} speed={0.5} offset={0.5} color={BLUE} />

        {/* analysis hub */}
        <Node
          position={[hub.x, hub.y, hub.z]}
          radius={0.4}
          color={CYAN}
          label="ANALYZE"
          detail={quality === "low" ? 0 : 2}
          pulse={1}
          reduced={reduced}
          onSelect={onSelect}
        />

        {/* STEP 5/6/7 — ingredients, additives + preservatives, concern flags */}
        {ingredients.map((p, i) => {
          const concern = i % 3 === 2;
          return (
            <Node
              key={i}
              position={[p.x, p.y, p.z]}
              radius={concern ? 0.16 : 0.13}
              color={concern ? "#FFB454" : i % 2 ? BLUE : DIM}
              emissive={concern ? 1.6 : 0.9}
              detail={quality === "low" ? 0 : 1}
              pulse={i}
              reduced={reduced}
              onSelect={onSelect}
              label={
                i === 0
                  ? "INGREDIENTS"
                  : i === 2
                    ? "POTENTIAL CONCERN"
                    : i === 3
                      ? "PRESERVATIVES"
                      : undefined
              }
            />
          );
        })}

        {/* STEP 8 — health rating */}
        <Packet path={outFlow} reduced={reduced} speed={0.35} />
        <group position={[rating.x, rating.y, rating.z]}>
          <mesh rotation={[0, 0, Math.PI * 0.25]}>
            <torusGeometry args={[0.46, 0.045, 8, quality === "low" ? 24 : 48, Math.PI * 1.35]} />
            <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.1} />
          </mesh>
        </group>
        <Node
          position={[rating.x, rating.y, rating.z]}
          radius={0.11}
          label="HEALTH RATING"
          reduced={reduced}
          onSelect={onSelect}
        />

        {/* STEP 9 — dietary compatibility */}
        <Node
          position={[dietary.x, dietary.y, dietary.z]}
          radius={0.17}
          color={BLUE}
          label="DIETARY FIT"
          reduced={reduced}
          onSelect={onSelect}
        />
        {/* STEP 10 — natural alternatives */}
        <Node
          position={[alternatives.x, alternatives.y, alternatives.z]}
          radius={0.17}
          color={CYAN}
          label="ALTERNATIVES"
          reduced={reduced}
          onSelect={onSelect}
        />
      </Orbit>
    </>
  );
}

export function NutriCodeVisualization({ className }: { className?: string }) {
  return (
    <Stage
      label="Interactive 3D NutriCode analysis system: scan, analyze, understand, choose"
      className={className ?? "h-[340px] sm:h-[400px] lg:h-[480px]"}
      camera={[0.2, 0.6, 9.6]}
      fov={48}
    >
      {({ drag, quality, reduced, onSelect }) => (
        <Scene drag={drag} quality={quality} reduced={reduced} onSelect={onSelect} />
      )}
    </Stage>
  );
}
