import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { projects } from "@/data/projects";
import { getProject, getTimeline } from "@/lib/projects";
import { Meta, Stat, TechBadges } from "@/components/ProjectCard";
import AnimatedFlow from "@/components/AnimatedFlow";
import GrowthStrip from "@/components/GrowthStrip";
import SafetyLadder from "@/components/SafetyLadder";
import Screenshots from "@/components/Screenshots";
import ScreenshotsScroll from "@/components/ScreenshotsScroll";

type Props = { params: Promise<{ slug: string }> };

// Skips Next's dev-time "instant navigation" check. Safe here: generateStaticParams
// pre-builds every project page, so nothing is blocking for visitors.
export const instant = false;

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

  // Prev/next follow the timeline order (same story as the home page)
  const order = getTimeline();
  const idx = order.findIndex((x) => x.slug === p.slug);
  const prev = idx > 0 ? order[idx - 1] : null;
  const next = idx >= 0 && idx < order.length - 1 ? order[idx + 1] : null;

  const when = p.dateLabel ?? new Date(p.date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
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
        {p.links.github && (
          <a
            href={p.links.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-border px-4 py-2 font-mono text-sm hover:border-muted"
          >
            View on GitHub ↗
          </a>
        )}
        {p.links.extra?.map((l) => (
          <a
            key={l.url}
            href={l.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-border px-4 py-2 font-mono text-sm hover:border-muted"
          >
            {l.label} ↗
          </a>
        ))}
        {!p.links.github && !p.links.extra?.length && (
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
          <AnimatedFlow diagram={p.diagram} accent={p.accent} />
        </Section>
      )}

      {p.growth && (
        <Section title={p.growth.title} accent={p.accent}>
          <GrowthStrip growth={p.growth} accent={p.accent} />
        </Section>
      )}

      {p.ladder && (
        <Section title="Safety ladder" accent={p.accent}>
          <SafetyLadder ladder={p.ladder} accent={p.accent} />
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
          <div className="lg:hidden">
            <Screenshots shots={p.screenshots} />
          </div>
          <div className="hidden lg:block">
            <ScreenshotsScroll shots={p.screenshots} />
          </div>
        </Section>
      )}

      <nav aria-label="More projects" className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/projects/${prev.slug}`}
            className="rounded-2xl border border-border bg-card p-4 transition hover:border-[var(--accent)]"
            style={{ "--accent": prev.accent } as CSSProperties}
          >
            <div className="font-mono text-xs text-muted">← Earlier</div>
            <div className="mt-1 font-semibold">{prev.title}</div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/projects/${next.slug}`}
            className="rounded-2xl border border-border bg-card p-4 transition hover:border-[var(--accent)] sm:text-right"
            style={{ "--accent": next.accent } as CSSProperties}
          >
            <div className="font-mono text-xs text-muted">Later →</div>
            <div className="mt-1 font-semibold">{next.title}</div>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </main>
  );
}
