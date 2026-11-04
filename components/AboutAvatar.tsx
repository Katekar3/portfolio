"use client";

import { useEffect, useRef } from "react";

const clamp = (n: number) => Math.max(-1, Math.min(1, n));

// Illustrated portrait in an amber ring. On desktop the picture shifts and tilts a
// little toward the cursor. On touch screens and with "reduce motion" it stays still.
// The image is scaled up slightly (1.08) so the circle never shows a gap when it moves.
export default function AboutAvatar({ size = 160 }: { size?: number }) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduce) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        // -1 .. 1 = how far the cursor is from the avatar, relative to the window
        const dx = clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2));
        const dy = clamp((e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2));
        el.style.transform = `translate(${dx * 4}px, ${dy * 3}px) rotate(${dx * 3}deg) scale(1.08)`;
      });
    };

    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      className="overflow-hidden rounded-full border-2 border-amber-400/70 bg-card"
      style={{ width: size, height: size }}
    >
      {/* Plain <img> on purpose: one small static file, no optimisation needed */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ref}
        src="/avatar.webp"
        alt="Illustrated portrait of Yashmit Katekar"
        width={size}
        height={size}
        draggable={false}
        style={{ transform: "scale(1.08)" }}
        className="h-full w-full object-cover transition-transform duration-200 ease-out motion-reduce:transition-none"
      />
    </div>
  );
}
