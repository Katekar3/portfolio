import type { Metadata } from "next";
import Hero3D from "@/components/hero3d/Hero3D";
import { projects } from "@/data/projects";

export const metadata: Metadata = { title: "3D lab", robots: { index: false } };

export default function LabPage() {
  const items = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    accent: p.accent,
    upcoming: p.status === "upcoming",
  }));

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <h1 className="text-2xl font-bold">3D lab</h1>
      <p className="mt-2 text-sm text-muted">
        Temporary test page. Desktop only (open it on your laptop).
      </p>
      <div className="mt-6 h-[540px] rounded-2xl border border-border bg-card">
        <Hero3D items={items} />
      </div>
    </main>
  );
}
