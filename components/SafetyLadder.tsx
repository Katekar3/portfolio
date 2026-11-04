import type { Project } from "@/data/projects";

type Ladder = NonNullable<Project["ladder"]>;

const labels = { auto: "Runs", ask: "Asks first", block: "Blocked" } as const;

// A static grid: risk level (rows) against autonomy mode (columns). Built only from the data.
export default function SafetyLadder({ ladder, accent }: { ladder: Ladder; accent: string }) {
  const pill = (cell: "auto" | "ask" | "block") => {
    if (cell === "ask") {
      return (
        <span
          className="rounded-full border px-2.5 py-1"
          style={{ borderColor: accent + "66", color: accent }}
        >
          {labels[cell]}
        </span>
      );
    }
    if (cell === "block") {
      return (
        <span className="rounded-full border border-rose-400/40 px-2.5 py-1 text-rose-400">
          {labels[cell]}
        </span>
      );
    }
    return (
      <span className="rounded-full border border-border px-2.5 py-1 text-muted">
        {labels[cell]}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] border-separate border-spacing-y-2 text-left font-mono text-xs">
        <thead>
          <tr>
            <th className="pb-1 font-normal text-muted">Tool-call risk</th>
            {ladder.modes.map((m) => (
              <th key={m} className="pb-1 font-normal uppercase tracking-widest text-muted">
                {m}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ladder.levels.map((l) => (
            <tr key={l.level}>
              <td className="pr-3 font-bold text-foreground">{l.level}</td>
              {l.cells.map((c, i) => (
                <td key={i}>{pill(c)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
