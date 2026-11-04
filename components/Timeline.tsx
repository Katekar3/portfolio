"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import Reveal from "@/components/Reveal";
import { Meta } from "@/components/ProjectCard";
import { getTimeline } from "@/lib/projects";
import type { Project } from "@/data/projects";

// dateLabel wins when present ("Ongoing", "Sept 2026"), otherwise month + year
function whenLabel(p: Project) {
  return (
    p.dateLabel ??
    new Date(p.date).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })
  );
}

// Oldest to newest. Built from the data, so new projects appear automatically.
export default function Timeline() {
  const items = getTimeline();
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // The bright line fills down as the timeline scrolls through the screen
  const { scrollYProgress } = useScroll({ target: ref, offset: ["0 0.8", "1 0.6"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <div ref={ref} className="relative max-w-3xl">
      {/* The static line, always visible */}
      <div aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-border" />
      {/* The animated line on top of it (skipped with reduce motion) */}
      {!reduce && (
        <motion.div
          aria-hidden
          style={{ scaleY, transformOrigin: "top" }}
          className="absolute bottom-0 left-0 top-0 w-px bg-foreground/60"
        />
      )}

      <ol className="pl-8">
        {items.map((p) => (
          <li key={p.slug} className="relative pb-10 last:pb-0">
            <span
              className="absolute -left-[38px] top-1.5 h-3 w-3 rounded-full"
              style={{ background: p.accent }}
            />
            <Reveal>
              <div className="font-mono text-xs uppercase tracking-widest text-muted">
                {whenLabel(p)}
              </div>
              <Link
                href={`/projects/${p.slug}`}
                className="mt-2 block rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-muted"
              >
                <Meta p={p} />
                <h3 className="mt-2 text-lg font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted">{p.tagline}</p>
                <div className="mt-3">
                  <div className="font-mono text-sm" style={{ color: p.accent }}>
                    {p.signatureStat.value}
                  </div>
                  <div className="font-mono text-xs text-muted">{p.signatureStat.label}</div>
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
