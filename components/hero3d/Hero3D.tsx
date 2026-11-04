"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Item } from "./Scene";

// Plain code-built stand-in: shown while the 3D loads, with "reduce motion", with data saver, and when WebGL is missing.
function Fallback() {
  return (
    <div aria-hidden className="grid h-full w-full place-items-center">
      <div className="relative h-44 w-44 sm:h-56 sm:w-56">
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

export default function Hero3D({ items }: { items: Item[] }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false); // this device passed the checks
  const [seen, setSeen] = useState(false); // the orbit has been on screen at least once
  const [active, setActive] = useState(true); // currently on screen (pauses drawing when not)
  const [mobile, setMobile] = useState(false); // touch / small screen: lighter scene + tap behaviour
  const [hover, setHover] = useState<Item | null>(null);

  // Device checks. Never with "reduce motion", data saver or without WebGL; short delay first.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2") ?? probe.getContext("webgl");
    if (!gl) return;
    gl.getExtension("WEBGL_lose_context")?.loseContext();

    const isMobile = window.matchMedia("(max-width: 1023px), (pointer: coarse)").matches;
    setMobile(isMobile);
    const t = window.setTimeout(() => setReady(true), isMobile ? 1000 : 700);
    return () => window.clearTimeout(t);
  }, []);

  // Pause drawing while off screen. Also: three.js is only downloaded once the orbit has been seen.
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      setActive(e.isIntersecting);
      if (e.isIntersecting) setSeen(true);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const show3d = ready && seen;

  return (
    <div ref={boxRef} className="relative h-full w-full">
      <div aria-hidden className="h-full w-full">
        {show3d ? (
          <Scene items={items} onHover={setHover} active={active} mobile={mobile} />
        ) : (
          <Fallback />
        )}
      </div>

      {/* Label: on desktop it follows the hover; on touch it appears after the first tap and is tappable */}
      {show3d &&
        hover &&
        (mobile ? (
          <Link
            href={`/projects/${hover.slug}`}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 font-mono text-xs"
          >
            {hover.title}
            {hover.upcoming ? " · up next" : ""} →
          </Link>
        ) : (
          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-border bg-card px-3 py-1 font-mono text-xs">
            {hover.title}
            {hover.upcoming ? " · up next" : ""}
          </div>
        ))}

      {show3d && mobile && !hover && (
        <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[11px] text-muted">
          Tap a planet
        </div>
      )}
    </div>
  );
}
