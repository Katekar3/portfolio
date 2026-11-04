"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";

export type Item = { slug: string; title: string; accent: string; upcoming: boolean };

const AMBER = "#f59e0b";

// Tilts everything inside it a little. Desktop: toward the mouse. Touch: a slow self-sway
// (a finger has no hover position, and we don't want to react to swipes that are scrolling the page).
function Sway({
  children,
  auto,
  strength = 0.35,
}: {
  children: React.ReactNode;
  auto: boolean;
  strength?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ pointer, clock }, dt) => {
    const g = ref.current;
    if (!g) return;
    const t = clock.elapsedTime;
    const ty = auto ? Math.sin(t * 0.4) * 0.25 : pointer.x * strength;
    const tx = auto ? Math.cos(t * 0.3) * 0.12 : -pointer.y * strength * 0.6;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, ty, 3, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, tx, 3, dt);
  });
  return <group ref={ref}>{children}</group>;
}

// One sphere per project, all the same size (nothing implies one is "bigger").
// Sphere color = that project's accent. Hollow wireframe = not built yet (upcoming).
// Desktop: hover shows the name, click opens. Touch: first tap shows the name, second tap opens.
function Planet({
  item,
  position,
  mobile,
  picked,
  onHover,
  onPick,
  onOpen,
}: {
  item: Item;
  position: [number, number, number];
  mobile: boolean;
  picked: string | null;
  onHover: (i: Item | null) => void;
  onPick: (slug: string) => void;
  onOpen: () => void;
}) {
  const [hot, setHot] = useState(false);
  useEffect(() => () => void (document.body.style.cursor = ""), []);

  const isPicked = mobile && picked === item.slug;
  const lit = hot || isPicked;
  const seg = mobile ? 16 : 24;

  return (
    <group
      position={position}
      scale={lit ? 1.35 : 1}
      onPointerOver={(e) => {
        if (mobile) return;
        e.stopPropagation();
        setHot(true);
        onHover(item);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        if (mobile) return;
        setHot(false);
        onHover(null);
        document.body.style.cursor = "";
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (mobile && picked !== item.slug) {
          onPick(item.slug);
          onHover(item);
          return;
        }
        onOpen();
      }}
    >
      <mesh>
        <sphereGeometry args={[0.24, seg, seg]} />
        <meshStandardMaterial
          color={item.accent}
          emissive={item.accent}
          emissiveIntensity={lit ? 0.8 : 0.35}
          wireframe={item.upcoming}
        />
      </mesh>
      {/* Invisible bigger target so a fingertip can hit the small sphere */}
      {mobile && (
        <mesh>
          <sphereGeometry args={[0.55, 8, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

function Constellation({
  items,
  mobile,
  picked,
  onHover,
  onPick,
}: {
  items: Item[];
  mobile: boolean;
  picked: string | null;
  onHover: (i: Item | null) => void;
  onPick: (slug: string) => void;
}) {
  const router = useRouter();
  const orbit = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (orbit.current) orbit.current.rotation.y += dt * 0.15;
  });
  const R = 2.3;
  const seg = mobile ? 20 : 32;

  return (
    <Sway auto={mobile}>
      <mesh>
        <sphereGeometry args={[0.5, seg, seg]} />
        <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={0.9} />
      </mesh>
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[R, 0.006, 8, mobile ? 96 : 160]} />
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
              mobile={mobile}
              picked={picked}
              onHover={onHover}
              onPick={onPick}
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
  mobile,
}: {
  items: Item[];
  onHover: (i: Item | null) => void;
  active: boolean;
  mobile: boolean;
}) {
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      // Lighter on phones: lower pixel ratio, no antialiasing, low-power GPU hint
      dpr={mobile ? [1, 1.5] : [1, 1.75]}
      camera={{ position: [0, 0, mobile ? 8.2 : 7.5], fov: 45 }}
      gl={{ antialias: !mobile, powerPreference: mobile ? "low-power" : "default" }}
      style={mobile ? { touchAction: "pan-y" } : undefined}
      onCreated={({ gl }) => {
        // Let vertical swipes over the orbit keep scrolling the page
        if (mobile) gl.domElement.style.touchAction = "pan-y";
      }}
      onPointerMissed={() => {
        // Tap on empty space: clear the selected planet
        if (!mobile) return;
        setPicked(null);
        onHover(null);
      }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <Constellation items={items} mobile={mobile} picked={picked} onHover={onHover} onPick={setPicked} />
    </Canvas>
  );
}
