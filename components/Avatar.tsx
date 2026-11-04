"use client";

import { useEffect, useRef } from "react";

// Code-built mascot. The pupils and head lean toward the cursor.
// Static with "reduce motion" and on touch screens (no cursor there).
export default function Avatar({ size = 160 }: { size?: number }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const pupilsRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tx = 0; // target, -1..1
    let ty = 0;
    let cx = 0; // current, eases toward target
    let cy = 0;
    let raf = 0;

    const apply = () => {
      headRef.current?.setAttribute("transform", `translate(${cx * 4} ${cy * 3})`);
      pupilsRef.current?.setAttribute("transform", `translate(${cx * 8} ${cy * 7})`);
    };

    const tick = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      apply();
      // stop looping once it has settled
      if (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const onMove = (e: PointerEvent) => {
      const svg = svgRef.current;
      if (!svg) return;
      const r = svg.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(d / 250, 1); // full lean at 250px away
      tx = (dx / d) * k;
      ty = (dy / d) * k;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      aria-hidden
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className="shrink-0"
    >
      <defs>
        <radialGradient id="avatar-face" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="60%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>
      </defs>
      <g ref={headRef}>
        <circle cx="100" cy="100" r="80" fill="url(#avatar-face)" />
        <circle cx="58" cy="118" r="10" fill="#ef4444" opacity="0.25" />
        <circle cx="142" cy="118" r="10" fill="#ef4444" opacity="0.25" />
        <circle cx="72" cy="92" r="18" fill="#fff7ed" />
        <circle cx="128" cy="92" r="18" fill="#fff7ed" />
        <g ref={pupilsRef}>
          <circle cx="72" cy="92" r="8" fill="#1a1614" />
          <circle cx="128" cy="92" r="8" fill="#1a1614" />
        </g>
        <path
          d="M74 130 Q100 152 126 130"
          fill="none"
          stroke="#1a1614"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
