"use client";

import { useAnimeOnView } from "@/components/useAnimeOnView";

// Splits "92.99%" into prefix "", number 92.99, suffix "%". No number = no animation.
function parse(v: string) {
  const m = v.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  return { prefix: m[1], num: Number(m[2]), digits: m[2].split(".")[1]?.length ?? 0, suffix: m[3] };
}

// Counts up from 0 to the real value when it first appears. The real value is what is
// rendered by default, so with "reduce motion" or no JS you just see the final number.
export default function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useAnimeOnView<HTMLDivElement>((root, { animate }) => {
    const p = parse(value);
    if (!p) return;
    const show = (n: number) => `${p.prefix}${n.toFixed(p.digits)}${p.suffix}`;
    const counter = { v: 0 };
    root.textContent = show(0);

    animate(counter, {
      v: p.num,
      delay: 400, // lets the hero fade-up land first
      duration: 1200,
      ease: "outExpo",
      onUpdate: () => {
        root.textContent = show(counter.v);
      },
      onComplete: () => {
        root.textContent = value; // end on the exact original text
      },
    });
  });

  return (
    <div ref={ref} className={className}>
      {value}
    </div>
  );
}
