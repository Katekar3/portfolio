import type { Metadata } from "next";
import Link from "next/link";
import { about } from "@/data/about";

export const metadata: Metadata = { title: "About | Yashmit Katekar" };

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Link href="/" className="font-mono text-sm text-muted hover:text-foreground">
        ← Home
      </Link>

      <h1 className="mt-8 text-4xl font-bold">About me</h1>

      <div className="mt-6 max-w-2xl space-y-4 leading-relaxed text-foreground/80">
        {about.paragraphs.map((text) => (
          <p key={text}>{text}</p>
        ))}
        {about.headingTo && <p>{about.headingTo}</p>}
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
