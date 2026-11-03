import Link from "next/link";
import type { Project } from "@/data/projects";

const statusLabel = {
  completed: "Shipped",
  "in-progress": "Still cooking",
  upcoming: "Up next",
} as const;

// The signature stat block: the big number, in the project's own accent color
export function Stat({ p }: { p: Project }) {
  return (
    <div
      className="inline-block rounded-xl border px-4 py-3"
      style={{ borderColor: p.accent + "55", background: p.accent + "12" }}
    >
      <div className="font-mono text-2xl font-bold" style={{ color: p.accent }}>
        {p.signatureStat.value}
      </div>
      <div className="font-mono text-xs text-muted">{p.signatureStat.label}</div>
    </div>
  );
}

export function TechBadges({ p, max }: { p: Project; max: number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {p.tech.slice(0, max).map((t) => (
        <span key={t} className="rounded-full border border-border px-2.5 py-1 font-mono text-xs text-muted">
          {t}
        </span>
      ))}
    </div>
  );
}

export function Meta({ p }: { p: Project }) {
  return (
    <div className="flex items-center gap-2 font-mono text-xs text-muted">
      <span>{p.category}</span>
      <span>·</span>
      <span style={{ color: p.accent }}>{statusLabel[p.status]}</span>
    </div>
  );
}

export default function ProjectCard({ project: p }: { project: Project }) {
  const href = `/projects/${p.slug}`;
  const base =
    "block rounded-2xl border bg-card transition hover:-translate-y-0.5 hover:border-muted";

  // FLAGSHIP: big card with Problem → Approach → Result
  if (p.tier === "flagship") {
    return (
      <Link href={href} className={`${base} border-border p-6 sm:p-8`}>
        <Meta p={p} />
        <h3 className="mt-3 text-2xl font-semibold">{p.title}</h3>
        <p className="mt-1 text-muted">{p.tagline}</p>
        <div className="mt-5"><Stat p={p} /></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            ["Problem", p.problem],
            ["Approach", p.approach],
            ["Result", p.result],
          ].map(([label, text]) => (
            <div key={label}>
              <div className="font-mono text-xs uppercase tracking-widest" style={{ color: p.accent }}>
                {label}
              </div>
              <p className="mt-1 line-clamp-4 text-sm text-muted">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-6"><TechBadges p={p} max={8} /></div>
      </Link>
    );
  }

  // SOLID: medium card
  if (p.tier === "solid") {
    return (
      <Link href={href} className={`${base} border-border p-5`}>
        <Meta p={p} />
        <h3 className="mt-2 text-lg font-semibold">{p.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{p.tagline}</p>
        <div className="mt-4"><Stat p={p} /></div>
        <div className="mt-4"><TechBadges p={p} max={4} /></div>
      </Link>
    );
  }

  // FOUNDATION: one compact card
  if (p.tier === "foundation") {
    return (
      <Link href={href} className={`${base} flex items-center justify-between gap-4 border-border p-4`}>
        <div>
          <h3 className="font-semibold">{p.title}</h3>
          <p className="text-sm text-muted">{p.tagline}</p>
        </div>
        <span className="font-mono text-sm" style={{ color: p.accent }}>
          {p.signatureStat.value}
        </span>
      </Link>
    );
  }

  // UPCOMING: low prominence, dashed border
  return (
    <Link href={href} className={`${base} border-dashed border-border p-4 opacity-80`}>
      <Meta p={p} />
      <h3 className="mt-1 font-semibold">{p.title}</h3>
      <p className="text-sm text-muted">{p.tagline}</p>
    </Link>
  );
}