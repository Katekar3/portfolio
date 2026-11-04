"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";

export type Item = { slug: string; title: string; accent: string; upcoming: boolean };
export type Variant = 1 | 2 | 3;

const AMBER = "#f59e0b";

// Tilts everything inside it a little toward the mouse.
function Sway({ children, strength = 0.35 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ pointer }, dt) => {
    const g = ref.current;
    if (!g) return;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, pointer.x * strength, 3, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -pointer.y * strength * 0.6, 3, dt);
  });
  return <group ref={ref}>{children}</group>;
}

/* ---------- Idea 1: project constellation ----------
   One sphere per project, all the same size (nothing implies one is "bigger").
   Sphere color = that project's accent. Hollow wireframe = not built yet (upcoming). */
function Planet({
  item,
  position,
  onHover,
  onOpen,
}: {
  item: Item;
  position: [number, number, number];
  onHover: (i: Item | null) => void;
  onOpen: () => void;
}) {
  const [hot, setHot] = useState(false);
  useEffect(() => () => void (document.body.style.cursor = ""), []);

  return (
    <mesh
      position={position}
      scale={hot ? 1.35 : 1}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHot(true);
        onHover(item);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHot(false);
        onHover(null);
        document.body.style.cursor = "";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
    >
      <sphereGeometry args={[0.24, 24, 24]} />
      <meshStandardMaterial
        color={item.accent}
        emissive={item.accent}
        emissiveIntensity={hot ? 0.8 : 0.35}
        wireframe={item.upcoming}
      />
    </mesh>
  );
}

function Constellation({ items, onHover }: { items: Item[]; onHover: (i: Item | null) => void }) {
  const router = useRouter();
  const orbit = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (orbit.current) orbit.current.rotation.y += dt * 0.15;
  });
  const R = 2.3;

  return (
    <Sway>
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={0.9} />
      </mesh>
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[R, 0.006, 8, 160]} />
        <meshBasicMaterial color="#3a322d" />
      </mesh>
      <group ref={orbit}>
        {items.map((it, i) => {
          const a = (i / items.length) * Math.PI * 2;
          const y = Math.sin(i * 2.1) * 0.25;
          return (
            <Planet
              key={it.slug}
              item={it}
              position={[Math.cos(a) * R, y, Math.sin(a) * R]}
              onHover={onHover}
              onOpen={() => router.push(`/projects/${it.slug}`)}
            />
          );
        })}
      </group>
    </Sway>
  );
}

/* ---------- Idea 2: layered network ----------
   Pure decoration (not tied to your data). A glow travels left to right through the layers. */
const LAYERS = [4, 6, 6, 3];

function Network() {
  const { nodes, geo } = useMemo(() => {
    const nodes: { pos: [number, number, number]; layer: number }[] = [];
    const byLayer: THREE.Vector3[][] = [];
    LAYERS.forEach((count, l) => {
      const col: THREE.Vector3[] = [];
      for (let j = 0; j < count; j++) {
        const x = (l - (LAYERS.length - 1) / 2) * 1.5;
        const y = (j - (count - 1) / 2) * 0.7 + Math.sin(l * 12.9 + j * 78.2) * 0.12;
        const z = Math.sin(l * 5.3 + j * 3.1) * 0.5;
        col.push(new THREE.Vector3(x, y, z));
        nodes.push({ pos: [x, y, z], layer: l });
      }
      byLayer.push(col);
    });
    const pts: THREE.Vector3[] = [];
    for (let l = 0; l < byLayer.length - 1; l++)
      for (const a of byLayer[l]) for (const b of byLayer[l + 1]) pts.push(a, b);
    return { nodes, geo: new THREE.BufferGeometry().setFromPoints(pts) };
  }, []);

  const mats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    nodes.forEach((n, i) => {
      const m = mats.current[i];
      if (!m) return;
      m.emissiveIntensity = 0.15 + Math.max(0, Math.sin(t * 1.6 - n.layer * 0.9)) * 1.1;
    });
  });

  return (
    <Sway strength={0.45}>
      <lineSegments geometry={geo}>
        <lineBasicMaterial color="#a39a90" transparent opacity={0.22} />
      </lineSegments>
      {nodes.map((n, i) => (
        <mesh key={i} position={n.pos}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            ref={(m) => {
              mats.current[i] = m;
            }}
            color={AMBER}
            emissive={AMBER}
            emissiveIntensity={0.15}
          />
        </mesh>
      ))}
    </Sway>
  );
}

/* ---------- Idea 3: floating Y logo ---------- */
function YLogo() {
  const spin = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (spin.current) spin.current.rotation.y += dt * 0.5;
  });
  const tilt = Math.PI / 6;

  return (
    <Sway strength={0.25}>
      <group ref={spin} position={[0, 0.05, 0]} scale={1.2}>
        <mesh position={[0, -0.65, 0]}>
          <boxGeometry args={[0.5, 1.3, 0.5]} />
          <meshStandardMaterial color={AMBER} metalness={0.35} roughness={0.35} />
        </mesh>
        <mesh position={[-0.35, 0.606, 0]} rotation-z={tilt}>
          <boxGeometry args={[0.5, 1.4, 0.5]} />
          <meshStandardMaterial color={AMBER} metalness={0.35} roughness={0.35} />
        </mesh>
        <mesh position={[0.35, 0.606, 0]} rotation-z={-tilt}>
          <boxGeometry args={[0.5, 1.4, 0.5]} />
          <meshStandardMaterial color={AMBER} metalness={0.35} roughness={0.35} />
        </mesh>
      </group>
    </Sway>
  );
}

export default function Scene({
  variant,
  items,
  onHover,
  active,
}: {
  variant: Variant;
  items: Item[];
  onHover: (i: Item | null) => void;
  active: boolean;
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, variant === 3 ? 6 : 7.5], fov: 45 }}
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      {variant === 1 && <Constellation items={items} onHover={onHover} />}
      {variant === 2 && <Network />}
      {variant === 3 && <YLogo />}
    </Canvas>
  );
}
