"use client";

import { useEffect, useRef, useState } from "react";

type Shot = { src: string; caption: string };

// One screenshot at a time, in a fixed-size stage, so wide and phone shots never
// squash or stretch the layout. Swipe / arrows / dots to move.
// Phones (no hover): slides advance by themselves while visible, and stop for good
// at the first touch or click. Reduce motion = no autoplay, no smooth scrolling.
export default function Screenshots({ shots }: { shots: Shot[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const stopped = useRef(false);
  const [index, setIndex] = useState(0);

  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function go(i: number) {
    const el = scroller.current;
    if (!el) return;
    const n = (i + shots.length) % shots.length;
    el.scrollTo({ left: n * el.clientWidth, behavior: reduced() ? "auto" : "smooth" });
  }

  function onScroll() {
    const el = scroller.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  }

  useEffect(() => {
    const el = scroller.current;
    if (!el || shots.length < 2) return;
    if (reduced()) return;
    if (!window.matchMedia("(hover: none)").matches) return; // phones/tablets only

    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.6 });
    io.observe(el);

    const stop = () => {
      stopped.current = true;
    };
    el.addEventListener("pointerdown", stop);
    el.addEventListener("touchstart", stop, { passive: true });

    const timer = setInterval(() => {
      if (stopped.current || !visible) return;
      const next = (Math.round(el.scrollLeft / el.clientWidth) + 1) % shots.length;
      el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    }, 4000);

    return () => {
      clearInterval(timer);
      io.disconnect();
      el.removeEventListener("pointerdown", stop);
      el.removeEventListener("touchstart", stop);
    };
  }, [shots.length]);

  const manual = (i: number) => {
    stopped.current = true;
    go(i);
  };

  return (
    <div>
      <div className="relative rounded-2xl border border-border bg-card">
        <div
          ref={scroller}
          onScroll={onScroll}
          tabIndex={0}
          aria-label="Screenshots"
          className="flex snap-x snap-mandatory overflow-x-auto rounded-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {shots.map((s, i) => (
            <figure key={s.src} className="w-full shrink-0 snap-center p-2">
              <div className="flex h-[20rem] items-center justify-center rounded-lg bg-black/30 sm:h-[30rem]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.src}
                  alt={s.caption}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="max-h-full max-w-full rounded-lg object-contain"
                />
              </div>
            </figure>
          ))}
        </div>

        {shots.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => manual(index - 1)}
              aria-label="Previous screenshot"
              className="absolute left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 rounded-full border border-border bg-background/80 font-mono hover:border-muted sm:block"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => manual(index + 1)}
              aria-label="Next screenshot"
              className="absolute right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 rounded-full border border-border bg-background/80 font-mono hover:border-muted sm:block"
            >
              →
            </button>
          </>
        )}
      </div>

      <div className="mt-3 flex items-start justify-between gap-4">
        <p className="font-mono text-xs text-muted" aria-live="polite">
          {shots[index]?.caption}
        </p>
        <span className="shrink-0 font-mono text-xs text-muted">
          {index + 1} / {shots.length}
        </span>
      </div>

      {shots.length > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {shots.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => manual(i)}
              aria-label={`Go to screenshot ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-foreground" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
