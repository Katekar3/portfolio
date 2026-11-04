"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { getByTier } from "@/lib/projects";
import { projects } from "@/data/projects";
import type { Category, Project, Tier } from "@/data/projects";

type Match = (p: Project) => boolean;

// A tech tag only shows in the dropdown if at least this many projects use it
const MIN_TECH_COUNT = 2;

const categoryOrder: Category[] = ["ML", "Web", "Mobile", "Other"];

const sections: { tier: Tier; title: string; grid: string }[] = [
  { tier: "flagship", title: "Flagship", grid: "grid gap-6" },
  { tier: "solid", title: "Solid", grid: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" },
  { tier: "foundation", title: "Foundations", grid: "grid gap-4" },
  { tier: "upcoming", title: "Upcoming", grid: "grid gap-4" },
];

// Filter options are built from the data, so new projects show up automatically
const categories = categoryOrder.filter((c) => projects.some((p) => p.category === c));

const techCounts = new Map<string, number>();
projects.forEach((p) => p.tech.forEach((t) => techCounts.set(t, (techCounts.get(t) ?? 0) + 1)));
const techs = [...techCounts.entries()]
  .filter(([, n]) => n >= MIN_TECH_COUNT)
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3 py-1 font-mono text-xs transition ${
        active ? "bg-card text-foreground" : "text-muted hover:text-foreground"
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

export default function ProjectsView() {
  const [category, setCategory] = useState<Category | null>(null);
  const [tech, setTech] = useState(""); // "" = all tech

  // Category AND tech must both match
  const match: Match = (p) =>
    (category === null || p.category === category) && (tech === "" || p.tech.includes(tech));

  const shown = projects.filter(match).length;
  const filtering = category !== null || tech !== "";

  const clear = () => {
    setCategory(null);
    setTech("");
  };

  return (
    <>
      {/* Compact filter bar: type chips + one tech dropdown */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {categories.length > 1 && (
          <div className="inline-flex flex-wrap gap-1 rounded-full border border-border p-1">
            <Chip label="All" active={category === null} onClick={() => setCategory(null)} />
            {categories.map((c) => (
              <Chip key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
            ))}
          </div>
        )}

        {techs.length > 0 && (
          <select
            value={tech}
            onChange={(e) => setTech(e.target.value)}
            aria-label="Filter by tech"
            className="rounded-full border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground"
          >
            <option value="">All tech</option>
            {techs.map(([t, n]) => (
              <option key={t} value={t}>
                {t} ({n})
              </option>
            ))}
          </select>
        )}

        {filtering && (
          <button
            type="button"
            onClick={clear}
            className="font-mono text-xs text-muted underline hover:text-foreground"
          >
            Clear · {shown} of {projects.length}
          </button>
        )}
      </div>

      {shown === 0 ? (
        <p className="mt-12 font-mono text-sm text-muted">
          Nothing matches that combo yet.{" "}
          <button type="button" onClick={clear} className="underline hover:text-foreground">
            Clear filters
          </button>
        </p>
      ) : (
        <Ranked match={match} />
      )}
    </>
  );
}
