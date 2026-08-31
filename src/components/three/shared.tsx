import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import type { DragState } from "./Stage";

export const CYAN = "#27E6D2";
export const BLUE = "#5B8CFF";
export const PALE = "#F2F5F3";
export const DIM = "#8B949E";

/** Group that follows drag rotation, pointer parallax and a slow idle drift. */
export function Orbit({
  drag,
  reduced,
  spin = 0.06,
  children,
}: {
  drag: React.MutableRefObject<DragState>;
  reduced: boolean;
  spin?: number;
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  const idle = useRef(0);

  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.05);
    const g = ref.current;
    if (!g) return;
    if (!reduced && !drag.current.active) idle.current += dt * spin;
    const targetY = drag.current.y + idle.current + (reduced ? 0 : drag.current.px * 0.18);
    const targetX = drag.current.x + (reduced ? 0 : drag.current.py * 0.12);
    const k = 1 - Math.exp(-6 * dt);
    g.rotation.y += (targetY - g.rotation.y) * k;
    g.rotation.x += (targetX - g.rotation.x) * k;
  });

  return <group ref={ref}>{children}</group>;
}

export function Lights({ quality }: { quality: "high" | "medium" | "low" }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 6]} intensity={quality === "low" ? 0.8 : 1.25} />
      {quality !== "low" && <pointLight position={[-5, -3, 3]} intensity={22} color={BLUE} />}
      {quality === "high" && <pointLight position={[3, 2, -4]} intensity={18} color={CYAN} />}
    </>
  );
}

/** Cheap non-Line2 edge set. */
export function Edges({
  points,
  color = CYAN,
  opacity = 0.28,
}: {
  points: [THREE.Vector3, THREE.Vector3][];
  color?: string;
  opacity?: number;
}) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const arr = new Float32Array(points.length * 6);
    points.forEach(([a, b], i) => {
      arr.set([a.x, a.y, a.z, b.x, b.y, b.z], i * 6);
    });
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [points]);

  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </lineSegments>
  );
}

/** Interactive node with optional floating technical label. */
export function Node({
  position,
  radius = 0.16,
  color = CYAN,
  label,
  emissive = 1.4,
  onSelect,
  detail = 1,
  pulse = 0,
  reduced,
}: {
  position: [number, number, number];
  radius?: number;
  color?: string;
  label?: string;
  emissive?: number;
  onSelect?: (l: string | null) => void;
  detail?: number;
  pulse?: number;
  reduced?: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const hover = useRef(false);

  useFrame((state, raw) => {
    const dt = Math.min(raw, 0.05);
    const m = ref.current;
    if (!m) return;
    const base = hover.current ? 1.45 : 1;
    const beat =
      reduced || pulse === 0 ? 0 : Math.sin(state.clock.elapsedTime * 2 + pulse) * 0.08;
    const target = base + beat;
    const k = 1 - Math.exp(-10 * dt);
    m.scale.setScalar(m.scale.x + (target - m.scale.x) * k);
  });

  return (
    <group position={position}>
      <mesh
        ref={ref}
        onPointerOver={() => (hover.current = true)}
        onPointerOut={() => (hover.current = false)}
        onPointerDown={(e) => {
          e.stopPropagation();
          onSelect?.(label ?? null);
        }}
      >
        <icosahedronGeometry args={[radius, detail]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissive}
          roughness={0.35}
          metalness={0.2}
        />
      </mesh>
      {label && (
        <Html
          center
          distanceFactor={9}
          position={[0, radius + 0.28, 0]}
          zIndexRange={[10, 0]}
          style={{ pointerEvents: "none" }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.14em",
              color: "var(--color-foreground)",
              whiteSpace: "nowrap",
              opacity: 0.75,
            }}
          >
            {label}
          </span>
        </Html>
      )}
    </group>
  );
}

/** Small floating data motes — restrained, not a particle explosion. */
export function Motes({ count, reduced }: { count: number; reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 11;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 7;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [count]);

  useFrame((_, raw) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.y += Math.min(raw, 0.05) * 0.02;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.045} color={PALE} transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

/** A packet travelling along a path of points, looping. */
export function Packet({
  path,
  color = CYAN,
  speed = 0.25,
  offset = 0,
  reduced,
  size = 0.075,
}: {
  path: THREE.Vector3[];
  color?: string;
  speed?: number;
  offset?: number;
  reduced?: boolean;
  size?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const t = useRef(offset);
  const curve = useMemo(() => new THREE.CatmullRomCurve3(path), [path]);

  useFrame((_, raw) => {
    const m = ref.current;
    if (!m) return;
    if (!reduced) t.current = (t.current + Math.min(raw, 0.05) * speed) % 1;
    const p = curve.getPoint(t.current);
    m.position.copy(p);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

export const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
