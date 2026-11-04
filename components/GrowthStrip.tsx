"use client";

import { useAnimeOnView } from "@/components/useAnimeOnView";
import type { Project } from "@/data/projects";

type Growth = NonNullable<Project["growth"]>;

const decimalsOf = (n: number) => String(n).split(".")[1]?.length ?? 0;

// Horizontal bars on a 0-100% scale. When it scrolls into view the bars fill in
// one after another and the numbers count up to the real values from the data.
export default function GrowthStrip({ growth, accent }: { growth: Growth; accent: string }) {
  const ref = useAnimeOnView<HTMLOListElement>((root, { animate, stagger }) => {
    const bars = Array.from(root.querySelectorAll<HTMLElement>("[data-bar]"));
    const nums = Array.from(root.querySelectorAll<HTMLElement>("[data-num]"));
    const deltas = Array.from(root.querySelectorAll<HTMLElement>("[data-delta]"));

    // Start state (set right before animating, so the page works without JS)
    bars.forEach((b) => {
      b.style.transform = "scaleX(0)";
    });
    nums.forEach((n) => {
      n.textContent = "0";
    });
    deltas.forEach((d) => {
      d.style.opacity = "0";
    });

    animate(bars, { scaleX: [0, 1], delay: stagger(250), duration: 1100, ease: "outExpo" });

    nums.forEach((el, i) => {
      const target = Number(el.dataset.num);
      const digits = decimalsOf(target);
      const counter = { v: 0 };
      animate(counter, {
        v: target,
        delay: i * 250,
        duration: 1100,
        ease: "outExpo",
        onUpdate: () => {
          el.textContent = counter.v.toFixed(digits);
        },
      });
    });

    animate(deltas, {
      opacity: [0, 1],
      delay: stagger(250, { start: 900 }),
      duration: 400,
    });
  });

  return (
    <ol ref={ref} className="space-y-4">
      {growth.steps.map((s, i) => {
        const prev = i > 0 ? growth.steps[i - 1].value : null;
        const delta = prev === null ? null : s.value - prev;
        return (
          <li key={s.label}>
            <div className="flex items-baseline justify-between gap-3 font-mono text-xs">
              <span className="text-muted">{s.label}</span>
              <span className="text-sm font-bold" style={{ color: accent }}>
                <span data-num={s.value}>{s.value}</span>%
                {delta !== null && (
                  <span data-delta className="ml-2 text-xs font-normal text-muted">
                    {delta >= 0 ? "+" : ""}
                    {delta.toFixed(1)} pts
                  </span>
                )}
              </span>
            </div>
            <div className="mt-1.5 h-2.5 rounded-full bg-border">
              <div
                data-bar
                className="h-full origin-left rounded-full"
                style={{ width: `${s.value}%`, background: accent }}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
