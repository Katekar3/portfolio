import type { Project } from "@/data/projects";

type Ladder = NonNullable<Project["ladder"]>;
type Cell = Ladder["levels"][number]["cells"][number];

const labels: Record<Cell, string> = {
  auto: "Runs",
  ask: "Asks first",
  mixed: "Reads run, rest ask",
  block: "Blocked",
};

// A static grid: risk level (rows) against autonomy mode (columns). Built only from the data.
export default function SafetyLadder({ ladder, accent }: { ladder: Ladder; accent: string }) {
  const pill = (cell: Cell) => {
    if (cell === "ask") {
      return (
        <span
          className="inline-block rounded-full border px-2.5 py-1"
          style={{ borderColor: accent + "66", color: accent }}
        >
          {labels[cell]}
        </span>
      );
    }
    if (cell === "mixed") {
      return (
        <span
          className="inline-block rounded-full border border-dashed px-2.5 py-1"
          style={{ borderColor: accent + "66", color: accent }}
        >
          {labels[cell]}
        </span>
      );
    }
    if (cell === "block") {
      return (
        <span className="inline-block rounded-full border border-rose-400/40 px-2.5 py-1 text-rose-400">
          {labels[cell]}
        </span>
      );
    }
    return (
      <span className="inline-block rounded-full border border-border px-2.5 py-1 text-muted">
        {labels[cell]}
      </span>
    );
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-separate border-spacing-y-2 text-left font-mono text-xs">
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
              <tr key={l.level} className="align-top">
                <td className="pr-4">
                  <div className="font-bold text-foreground">{l.level}</div>
                  {l.detail && (
                    <div className="mt-0.5 max-w-[16rem] font-sans text-xs font-normal text-muted">
                      {l.detail}
                    </div>
                  )}
                </td>
                {l.cells.map((c, i) => (
                  <td key={i} className="pr-2">
                    {pill(c)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {ladder.note && <p className="mt-3 text-sm text-muted">{ladder.note}</p>}
    </div>
  );
}
