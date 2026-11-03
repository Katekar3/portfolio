import ProjectCard from "@/components/ProjectCard";
import { getByTier } from "@/lib/projects";
import type { Tier } from "@/data/projects";

const sections: { tier: Tier; title: string; grid: string }[] = [
  { tier: "flagship", title: "Flagship", grid: "grid gap-6" },
  { tier: "solid", title: "Solid", grid: "grid gap-4 sm:grid-cols-2" },
  { tier: "foundation", title: "Foundations", grid: "grid gap-4" },
  { tier: "upcoming", title: "Upcoming", grid: "grid gap-4" },
];

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold">Things I&apos;ve built</h1>
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
    </main>
  );
}