"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";

export type Item = { slug: string; title: string; accent: string; upcoming: boolean };

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

// One sphere per project, all the same size (nothing implies one is "bigger").
// Sphere color = that project's accent. Hollow wireframe = not built yet (upcoming).
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

export default function Scene({
  items,
  onHover,
  active,
}: {
  items: Item[];
  onHover: (i: Item | null) => void;
  active: boolean;
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 7.5], fov: 45 }}
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <Constellation items={items} onHover={onHover} />
    </Canvas>
  );
}
