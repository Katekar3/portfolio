import type { Project } from "@/data/projects";

type Growth = NonNullable<Project["growth"]>;

// Horizontal bars on a 0-100% scale, one per stage. Built only from the data.
export default function GrowthStrip({ growth, accent }: { growth: Growth; accent: string }) {
  return (
    <ol className="space-y-4">
      {growth.steps.map((s, i) => {
        const prev = i > 0 ? growth.steps[i - 1].value : null;
        const delta = prev === null ? null : s.value - prev;
        return (
          <li key={s.label}>
            <div className="flex items-baseline justify-between gap-3 font-mono text-xs">
              <span className="text-muted">{s.label}</span>
              <span className="text-sm font-bold" style={{ color: accent }}>
                {s.value}%
                {delta !== null && (
                  <span className="ml-2 text-xs font-normal text-muted">
                    {delta >= 0 ? "+" : ""}
                    {delta.toFixed(1)} pts
                  </span>
                )}
              </span>
            </div>
            <div className="mt-1.5 h-2.5 rounded-full bg-border">
              <div
                className="h-full rounded-full"
                style={{ width: `${s.value}%`, background: accent }}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
