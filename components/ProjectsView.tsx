"use client";

import { useState } from "react";
import Link from "next/link";
import ProjectCard, { Meta } from "@/components/ProjectCard";
import { getByTier, getTimeline } from "@/lib/projects";
import type { Project, Tier } from "@/data/projects";

type View = "ranked" | "timeline";

const sections: { tier: Tier; title: string; grid: string }[] = [
  { tier: "flagship", title: "Flagship", grid: "grid gap-6" },
  { tier: "solid", title: "Solid", grid: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" },
  { tier: "foundation", title: "Foundations", grid: "grid gap-4" },
  { tier: "upcoming", title: "Upcoming", grid: "grid gap-4" },
];

// dateLabel wins when present ("Ongoing", "Sept 2026"), otherwise month + year
function whenLabel(p: Project) {
  return (
    p.dateLabel ??
    new Date(p.date).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })
  );
}

function Ranked() {
  return (
    <>
      {sections.map(({ tier, title, grid }) => {
        const items = getByTier(tier);
        if (items.length === 0) return null; // empty tiers hide themselves
        return (
          <section key={tier} className="mt-12">
            <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-muted">{title}</h2>
            <div className={grid}>
              {items.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}

function Timeline() {
  const items = getTimeline(); // oldest to newest
  return (
    <ol className="relative mt-12 border-l border-border pl-8">
      {items.map((p) => (
        <li key={p.slug} className="relative pb-10 last:pb-0">
          <span
            className="absolute -left-[39px] top-1.5 h-3 w-3 rounded-full"
            style={{ background: p.accent }}
          />
          <div className="font-mono text-xs uppercase tracking-widest text-muted">{whenLabel(p)}</div>
          <Link
            href={`/projects/${p.slug}`}
            className="mt-2 block rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-muted"
          >
            <Meta p={p} />
            <h3 className="mt-2 text-lg font-semibold">{p.title}</h3>
            <p className="mt-1 text-sm text-muted">{p.tagline}</p>
            <div className="mt-3 font-mono text-sm" style={{ color: p.accent }}>
              {p.signatureStat.value}{" "}
              <span className="text-xs text-muted">{p.signatureStat.label}</span>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}

export default function ProjectsView() {
  const [view, setView] = useState<View>("ranked");

  const btn = (v: View, label: string) => (
    <button
      type="button"
      onClick={() => setView(v)}
      aria-pressed={view === v}
      className={`rounded-full px-4 py-1.5 font-mono text-sm transition ${
        view === v ? "bg-card text-foreground" : "text-muted hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      <div className="mt-6 inline-flex gap-1 rounded-full border border-border p-1">
        {btn("ranked", "Ranked")}
        {btn("timeline", "Timeline")}
      </div>
      {view === "ranked" ? <Ranked /> : <Timeline />}
    </>
  );
}
