"use client";

import { useState } from "react";
import Link from "next/link";
import ProjectCard, { Meta } from "@/components/ProjectCard";
import { getByTier, getTimeline } from "@/lib/projects";
import { projects } from "@/data/projects";
import type { Category, Project, Tier } from "@/data/projects";

type View = "ranked" | "timeline";
type Match = (p: Project) => boolean;

// A tech tag only becomes a filter chip if at least this many projects use it
const MIN_TECH_COUNT = 2;

const categoryOrder: Category[] = ["ML", "Web", "Mobile", "Other"];

const sections: { tier: Tier; title: string; grid: string }[] = [
  { tier: "flagship", title: "Flagship", grid: "grid gap-6" },
  { tier: "solid", title: "Solid", grid: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" },
  { tier: "foundation", title: "Foundations", grid: "grid gap-4" },
  { tier: "upcoming", title: "Upcoming", grid: "grid gap-4" },
];

// Chip options are built from the data, so new projects show up automatically
const categories = categoryOrder.filter((c) => projects.some((p) => p.category === c));

const techCounts = new Map<string, number>();
projects.forEach((p) => p.tech.forEach((t) => techCounts.set(t, (techCounts.get(t) ?? 0) + 1)));
const techs = [...techCounts.entries()]
  .filter(([, n]) => n >= MIN_TECH_COUNT)
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .map(([t]) => t);

// dateLabel wins when present ("Ongoing", "Sept 2026"), otherwise month + year
function whenLabel(p: Project) {
  return (
    p.dateLabel ??
    new Date(p.date).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1 font-mono text-xs transition ${
        active
          ? "border-foreground/60 bg-card text-foreground"
          : "border-border text-muted hover:border-muted hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function Ranked({ match }: { match: Match }) {
  return (
    <>
      {sections.map(({ tier, title, grid }) => {
        const items = getByTier(tier).filter(match);
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

function Timeline({ match }: { match: Match }) {
  const items = getTimeline().filter(match); // oldest to newest
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
  const [category, setCategory] = useState<Category | null>(null);
  const [tech, setTech] = useState<string | null>(null);

  // One filter function shared by both views. Category AND tech must both match.
  const match: Match = (p) =>
    (category === null || p.category === category) && (tech === null || p.tech.includes(tech));

  const shown = projects.filter(match).length;
  const filtering = category !== null || tech !== null;

  const clear = () => {
    setCategory(null);
    setTech(null);
  };

  const viewBtn = (v: View, label: string) => (
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
        {viewBtn("ranked", "Ranked")}
        {viewBtn("timeline", "Timeline")}
      </div>

      {/* Filters */}
      <div className="mt-6 space-y-3">
        {categories.length > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-16 font-mono text-xs uppercase tracking-widest text-muted">Type</span>
            {categories.map((c) => (
              <Chip
                key={c}
                label={c}
                active={category === c}
                onClick={() => setCategory(category === c ? null : c)}
              />
            ))}
          </div>
        )}
        {techs.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-16 font-mono text-xs uppercase tracking-widest text-muted">Tech</span>
            {techs.map((t) => (
              <Chip key={t} label={t} active={tech === t} onClick={() => setTech(tech === t ? null : t)} />
            ))}
          </div>
        )}
        {filtering && (
          <div className="flex items-center gap-3 font-mono text-xs text-muted">
            <span>
              Showing {shown} of {projects.length}
            </span>
            <button type="button" onClick={clear} className="underline hover:text-foreground">
              Clear filters
            </button>
          </div>
        )}
      </div>

      {shown === 0 ? (
        <p className="mt-12 font-mono text-sm text-muted">
          Nothing matches that combo yet.{" "}
          <button type="button" onClick={clear} className="underline hover:text-foreground">
            Clear filters
          </button>
        </p>
      ) : view === "ranked" ? (
        <Ranked match={match} />
      ) : (
        <Timeline match={match} />
      )}
    </>
  );
}
