"use client";

import { useEffect, useRef, useState } from "react";

type Shot = { src: string; caption: string };

// Distance from the top of the viewport where the stage sticks (below the header).
const STICKY_TOP = 88;

// Laptop version: the section is tall and the stage sticks while you scroll through it.
// Scroll position decides which screenshot shows, so it works forwards and backwards
// with normal scrolling (no scroll hijacking).
export default function ScreenshotsScroll({ shots }: { shots: Shot[] }) {
  const outer = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const n = shots.length;

  useEffect(() => {
    if (n < 2) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const o = outer.current;
      const s = stage.current;
      if (!o || !s) return;
      const range = o.offsetHeight - s.offsetHeight; // how far you scroll while it's stuck
      if (range <= 0) return;
      const progress = (STICKY_TOP - o.getBoundingClientRect().top) / range;
      setIndex(Math.min(n - 1, Math.max(0, Math.floor(progress * n))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [n]);

  function goTo(i: number) {
    const o = outer.current;
    const s = stage.current;
    if (!o || !s) return;
    const range = o.offsetHeight - s.offsetHeight;
    const top = window.scrollY + o.getBoundingClientRect().top - STICKY_TOP + ((i + 0.5) / n) * range;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <div
      ref={outer}
      style={n > 1 ? { height: `calc(${n * 55}vh + 100vh - 7rem)` } : undefined}
    >
      <div
        ref={stage}
        className="sticky flex flex-col"
        style={{ top: STICKY_TOP, height: "calc(100vh - 7rem)", minHeight: "24rem" }}
      >
        <div className="relative min-h-0 flex-1 rounded-2xl border border-border bg-card">
          {shots.map((s, i) => (
            <div
              key={s.src}
              aria-hidden={i !== index}
              className={`absolute inset-0 flex items-center justify-center p-3 transition-opacity duration-500 motion-reduce:transition-none ${
                i === index ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.src}
                alt={s.caption}
                className="max-h-full max-w-full rounded-lg object-contain"
              />
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-start justify-between gap-4">
          <p className="font-mono text-xs text-muted" aria-live="polite">
            {shots[index]?.caption}
          </p>
          <span className="shrink-0 font-mono text-xs text-muted">
            {index + 1} / {n}
          </span>
        </div>

        {n > 1 && (
          <div className="mt-3 flex items-center justify-center gap-2">
            {shots.map((s, i) => (
              <button
                key={s.src}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to screenshot ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-foreground" : "w-2 bg-border"
                }`}
              />
            ))}
            {index < n - 1 && (
              <span className="ml-3 font-mono text-xs text-muted">keep scrolling ↓</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
