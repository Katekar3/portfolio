import Link from "next/link";
import { Meta } from "@/components/ProjectCard";
import { getTimeline } from "@/lib/projects";
import type { Project } from "@/data/projects";

// dateLabel wins when present ("Ongoing", "Sept 2026"), otherwise month + year
function whenLabel(p: Project) {
  return (
    p.dateLabel ??
    new Date(p.date).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })
  );
}

// Oldest to newest. Built from the data, so new projects appear automatically.
export default function Timeline() {
  const items = getTimeline();
  return (
    <ol className="relative max-w-3xl border-l border-border pl-8">
      {items.map((p) => (
        <li key={p.slug} className="relative pb-10 last:pb-0">
          <span
            className="absolute -left-[39px] top-1.5 h-3 w-3 rounded-full"
            style={{ background: p.accent }}
          />
          <div className="font-mono text-xs uppercase tracking-widest text-muted">{whenLabel(p)}</div>
          <Link
            href={`/projects/${p.slug}`}
            className="mt-2 block rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-muted"
          >
            <Meta p={p} />
            <h3 className="mt-2 text-lg font-semibold">{p.title}</h3>
            <p className="mt-1 text-sm text-muted">{p.tagline}</p>
            <div className="mt-3 font-mono text-sm" style={{ color: p.accent }}>
              {p.signatureStat.value}{" "}
              <span className="text-xs text-muted">{p.signatureStat.label}</span>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}
