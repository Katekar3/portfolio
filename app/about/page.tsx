import type { Metadata } from "next";
import Link from "next/link";
import { about } from "@/data/about";
import AboutAvatar from "@/components/AboutAvatar";
import { site } from "@/data/site";
import { getProject } from "@/lib/projects";

export const metadata: Metadata = { title: "About | Yashmit Katekar" };

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Link href="/" className="font-mono text-sm text-muted hover:text-foreground">
        ← Home
      </Link>

      <h1 className="mt-8 text-4xl font-bold">About me</h1>

      <div className="mt-6 flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl space-y-4 leading-relaxed text-foreground/80">
          {about.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
          {about.headingTo && <p>{about.headingTo}</p>}
        </div>

        {/* Cartoon avatar + two small chips + the license credit */}
        <div className="flex shrink-0 flex-col items-center gap-3 text-center">
          <AboutAvatar size={160} />

          <div className="flex flex-wrap justify-center gap-2">
            <span className="rounded-full border border-border px-2.5 py-1 font-mono text-xs text-foreground/80">
              Class of 2027
            </span>
            {site.nowBuilding && (
              <Link
                href={`/projects/${site.nowBuilding.slug}`}
                className="rounded-full border border-amber-400/40 px-2.5 py-1 font-mono text-xs text-amber-300 hover:border-amber-400"
              >
                Now building {getProject(site.nowBuilding.slug)?.title ?? site.nowBuilding.text}
              </Link>
            )}
          </div>

          <p className="max-w-[14rem] font-mono text-[11px] leading-snug text-muted">
            Avatar: Adventurer by{" "}
            <a
              href="https://www.figma.com/community/file/1184595184137881796"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-foreground"
            >
              Lisa Wischofsky
            </a>
            ,{" "}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-foreground"
            >
              CC BY 4.0
            </a>
          </p>
        </div>
      </div>

      <section className="mt-14">
        <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-muted">
          What I work with
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {about.skills.map((g) => (
            <div key={g.group} className="rounded-2xl border border-border bg-card p-5">
              <div className="font-mono text-xs uppercase tracking-widest text-muted">
                {g.group}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-border px-2.5 py-1 font-mono text-xs text-foreground/80"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-14">
        <Link
          href="/projects"
          className="rounded-full border border-border px-4 py-2 font-mono text-sm hover:border-muted"
        >
          See what I&apos;ve built →
        </Link>
      </div>
    </main>
  );
}
