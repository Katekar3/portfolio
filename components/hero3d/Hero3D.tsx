"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Item, Variant } from "./Scene";

// Plain code-built stand-in: shown while the 3D loads, with "reduce motion", and when WebGL is missing.
function Fallback() {
  return (
    <div aria-hidden className="grid h-full w-full place-items-center">
      <div className="relative h-56 w-56">
        <div className="absolute inset-0 rounded-full border border-dashed border-border" />
        <div
          className="absolute inset-[34%] rounded-full"
          style={{ background: "radial-gradient(circle at 35% 35%, #fbbf24, #f59e0b 60%, #b45309)" }}
        />
      </div>
    </div>
  );
}

// three.js is downloaded only when this chunk is actually needed (lazy).
const Scene = dynamic(() => import("./Scene"), { ssr: false, loading: () => <Fallback /> });

const NAMES: Record<Variant, string> = { 1: "1 · Orbit", 2: "2 · Network", 3: "3 · Logo" };

export default function Hero3D({
  items,
  variant = 1,
  showSwitcher = false,
}: {
  items: Item[];
  variant?: Variant;
  showSwitcher?: boolean;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"static" | "3d">("static");
  const [active, setActive] = useState(true);
  const [v, setV] = useState<Variant>(variant);
  const [hover, setHover] = useState<Item | null>(null);

  // 3D only on desktop, never with "reduce motion", never without WebGL, and only after a short delay.
  useEffect(() => {
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2") ?? probe.getContext("webgl");
    if (!gl) return;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    const t = window.setTimeout(() => setMode("3d"), 700);
    return () => window.clearTimeout(t);
  }, []);

  // Pause drawing while it's scrolled off screen.
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={boxRef} className="relative h-full w-full">
      <div aria-hidden className="h-full w-full">
        {mode === "3d" ? <Scene variant={v} items={items} onHover={setHover} active={active} /> : <Fallback />}
      </div>

      {mode === "3d" && v === 1 && hover && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-border bg-card px-3 py-1 font-mono text-xs">
          {hover.title}
          {hover.upcoming ? " · up next" : ""}
        </div>
      )}

      {showSwitcher && (
        <div className="absolute right-3 top-3 flex gap-1">
          {([1, 2, 3] as Variant[]).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                setHover(null);
                setV(n);
              }}
              className={`rounded-full border px-3 py-1 font-mono text-xs ${
                v === n ? "border-muted text-foreground" : "border-border text-muted hover:border-muted"
              }`}
            >
              {NAMES[n]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
