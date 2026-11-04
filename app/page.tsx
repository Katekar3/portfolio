import Link from "next/link";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import Timeline from "@/components/Timeline";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

const pill =
  "rounded-full border border-border px-4 py-2 font-mono text-sm hover:border-muted";

export default function Home() {
  // Computed from the data, so it can't go stale
  const shipped = projects.filter((p) => p.status === "completed").length;

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      {/* Hero: three groups that fade up one after another */}
      <header>
        <Reveal>
          {site.nowBuilding && (
            <Link
              href={`/projects/${site.nowBuilding.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-xs text-muted hover:border-muted"
            >
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Now building: {site.nowBuilding.text}
            </Link>
          )}

          <h1 className="mt-5 text-4xl font-bold sm:text-5xl">{site.name}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">{site.intro}</p>
          {site.availability && (
            <p className="mt-3 font-mono text-sm text-muted">{site.availability}</p>
          )}
        </Reveal>

        <Reveal delay={0.1} className="mt-6 flex flex-wrap gap-3">
          <Link href="/projects" className={pill}>
            View projects →
          </Link>
          {site.links.resume && (
            <a href={site.links.resume} target="_blank" rel="noreferrer" className={pill}>
              Resume ↗
            </a>
          )}
        </Reveal>

        <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-6 font-mono">
          <div>
            <CountUp value={String(shipped)} className="text-2xl font-bold" />
            <div className="text-xs text-muted">projects shipped</div>
          </div>
          {site.highlight && (
            <div>
              <CountUp value={site.highlight.value} className="text-2xl font-bold" />
              <div className="text-xs text-muted">{site.highlight.label}</div>
            </div>
          )}
        </Reveal>
      </header>

      {/* Timeline: the story, oldest to newest. Cards link to the detail pages. */}
      <section className="mt-16">
        <h2 className="mb-6 font-mono text-sm uppercase tracking-widest text-muted">
          How I got here
        </h2>
        <Timeline />
        <div className="mt-8">
          <Link href="/projects" className={pill}>
            View all projects →
          </Link>
        </div>
      </section>

      {/* Currently learning: hidden when the array is empty */}
      {site.learning.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-muted">
            Currently learning
          </h2>
          <ul className="flex flex-wrap gap-3">
            {site.learning.map((item) => (
              <li
                key={item.label}
                className="rounded-2xl border border-border bg-card px-4 py-3"
              >
                <div className="font-semibold">{item.label}</div>
                {item.note && <div className="text-sm text-muted">{item.note}</div>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Links: email, GitHub, LinkedIn, resume (no phone number, ever) */}
      <section className="mt-16 border-t border-border pt-8">
        <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-muted">
          Say hi
        </h2>
        <div className="flex flex-wrap gap-3">
          <a href={`mailto:${site.links.email}`} className={pill}>
            Email
          </a>
          <a href={site.links.github} target="_blank" rel="noreferrer" className={pill}>
            GitHub ↗
          </a>
          <a href={site.links.linkedin} target="_blank" rel="noreferrer" className={pill}>
            LinkedIn ↗
          </a>
          {site.links.resume && (
            <a href={site.links.resume} target="_blank" rel="noreferrer" className={pill}>
              Resume ↗
            </a>
          )}
        </div>
      </section>
    </main>
  );
}
