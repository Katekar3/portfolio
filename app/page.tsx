import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { getFeatured } from "@/lib/projects";
import Timeline from "@/components/Timeline";
import { site } from "@/data/site";

const pill =
  "rounded-full border border-border px-4 py-2 font-mono text-sm hover:border-muted";

export default function Home() {
  const featured = getFeatured();

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      {/* Hero: name + one-line intro */}
      <header>
        <h1 className="text-4xl font-bold sm:text-5xl">{site.name}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">{site.intro}</p>
        {site.availability && (
          <p className="mt-3 font-mono text-sm text-muted">{site.availability}</p>
        )}
      </header>

      {/* Featured projects (any project with featured: true) */}
      {featured.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-muted">
            Things I&apos;ve built
          </h2>
          <div className="grid gap-6">
            {featured.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
          <div className="mt-6">
            <Link href="/projects" className={pill}>
              View all projects →
            </Link>
          </div>
        </section>
      )}

      {/* Timeline: how the projects fit together, oldest to newest */}
      <section className="mt-16">
        <h2 className="mb-6 font-mono text-sm uppercase tracking-widest text-muted">
          How I got here
        </h2>
        <Timeline />
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
