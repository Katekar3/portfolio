import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { projects } from "@/data/projects";
import { getProject } from "@/lib/projects";
import { Meta, Stat, TechBadges } from "@/components/ProjectCard";
import FlowDiagram from "@/components/FlowDiagram";

type Props = { params: Promise<{ slug: string }> };

// Tells Next to build one page per project in the data file
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  return { title: p ? `${p.title} | Yashmit Katekar` : "Project not found" };
}

function Section({ title, accent, children }: { title: string; accent: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-mono text-xs uppercase tracking-widest" style={{ color: accent }}>
        {title}
      </h2>
      <div className="mt-2 leading-relaxed text-foreground/80">{children}</div>
    </section>
  );
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const when = new Date(p.date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Link href="/projects" className="font-mono text-sm text-muted hover:text-foreground">
        ← All projects
      </Link>

      <div className="mt-8">
        <Meta p={p} />
        <h1 className="mt-3 text-4xl font-bold">{p.title}</h1>
        <p className="mt-2 text-lg text-muted">{p.tagline}</p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Stat p={p} />
        {p.links.github ? (
          <a
            href={p.links.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-border px-4 py-2 font-mono text-sm hover:border-muted"
          >
            View on GitHub ↗
          </a>
        ) : (
          <span className="font-mono text-sm text-muted">Repository coming soon</span>
        )}
      </div>

      <dl className="mt-8 grid gap-4 border-y border-border py-4 text-sm sm:grid-cols-3">
        {[
          ["Role", p.role],
          ["Team", p.team],
          ["When", when],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="font-mono text-xs uppercase tracking-widest text-muted">{k}</dt>
            <dd className="mt-1">{v}</dd>
          </div>
        ))}
      </dl>

      <Section title="Problem" accent={p.accent}>{p.problem}</Section>
      <Section title="Approach" accent={p.accent}>{p.approach}</Section>
      <Section title="Result" accent={p.accent}>{p.result}</Section>

      {p.diagram && (
        <Section title="How it fits together" accent={p.accent}>
          <FlowDiagram diagram={p.diagram} accent={p.accent} />
        </Section>
      )}

      {p.features.length > 0 && (
        <Section title="Features" accent={p.accent}>
          <ul className="list-disc space-y-1 pl-5">
            {p.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </Section>
      )}

      {p.challenges && <Section title="Challenges" accent={p.accent}>{p.challenges}</Section>}
      {p.learnings && <Section title="What I learned" accent={p.accent}>{p.learnings}</Section>}

      <Section title="Tech" accent={p.accent}>
        <TechBadges p={p} max={99} />
      </Section>

      {/* Screens: optional, hidden when empty, always inside a neutral frame */}
      {p.screenshots && p.screenshots.length > 0 && (
        <Section title="Screens" accent={p.accent}>
          <div className="grid gap-6 sm:grid-cols-2">
            {p.screenshots.map((s) => (
              <figure key={s.src} className="rounded-xl border border-border bg-black/30 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt={s.caption} className="w-full rounded-lg" />
                <figcaption className="mt-2 px-1 font-mono text-xs text-muted">{s.caption}</figcaption>
              </figure>
            ))}
          </div>
        </Section>
      )}
    </main>
  );
}
