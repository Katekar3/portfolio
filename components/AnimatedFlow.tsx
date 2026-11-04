"use client";

import { Fragment } from "react";
import { useAnimeOnView } from "@/components/useAnimeOnView";
import type { Project } from "@/data/projects";

type Diagram = NonNullable<Project["diagram"]>;

// Same data as the old FlowDiagram. Boxes and arrows appear one after another
// when the diagram scrolls into view (down on mobile, left to right on desktop).
export default function AnimatedFlow({ diagram, accent }: { diagram: Diagram; accent: string }) {
  const ref = useAnimeOnView<HTMLOListElement>((root, { animate, stagger }) => {
    const parts = Array.from(root.querySelectorAll<HTMLElement>("[data-part]"));
    parts.forEach((p) => {
      p.style.opacity = "0";
    });
    const horizontal = window.matchMedia("(min-width: 1024px)").matches;

    animate(parts, {
      opacity: [0, 1],
      ...(horizontal ? { translateX: [-14, 0] } : { translateY: [14, 0] }),
      delay: stagger(110),
      duration: 600,
      ease: "outExpo",
    });
  });

  return (
    <ol ref={ref} className="flex flex-col gap-1 lg:flex-row lg:items-stretch lg:gap-2">
      {diagram.nodes.map((n, i) => (
        <Fragment key={`${n.label}-${i}`}>
          {i > 0 && (
            <li
              aria-hidden
              data-part
              className="flex items-center justify-center py-0.5 font-mono lg:px-1 lg:py-0"
              style={{ color: accent }}
            >
              <span className="lg:hidden">↓</span>
              <span className="hidden lg:inline">→</span>
            </li>
          )}
          <li
            data-part
            className="rounded-xl border bg-card px-4 py-3 lg:flex-1"
            style={{ borderColor: accent + "55" }}
          >
            <div className="font-mono text-sm font-semibold text-foreground">{n.label}</div>
            {n.sub && <div className="mt-0.5 text-xs text-muted">{n.sub}</div>}
          </li>
        </Fragment>
      ))}
    </ol>
  );
}
