import Link from "next/link";
import { broke } from "@/data/broke";
import { getProject } from "@/lib/projects";

export default function WhatBroke() {
  if (broke.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="mb-2 font-mono text-sm uppercase tracking-widest text-muted">
        What broke
      </h2>
      <p className="mb-6 max-w-2xl text-sm text-muted">
        Real bugs from my projects, and what I did about them. Click one for the full story.
      </p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {broke.map((b) => {
          const accent = getProject(b.slug)?.accent ?? "#3a322d";
          return (
            <li key={b.slug + b.broke}>
              <Link
                href={`/projects/${b.slug}`}
                className="block h-full rounded-2xl border border-border border-l-4 bg-card p-5 transition-colors hover:border-muted"
                style={{ borderLeftColor: accent }}
              >
                <div className="font-mono text-xs text-muted">{b.project}</div>
                <p className="mt-2 font-semibold">{b.broke}</p>
                <p className="mt-2 text-sm text-muted">
                  <span className="font-mono text-amber-500">Fix:</span> {b.fix}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
