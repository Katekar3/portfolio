import { Fragment } from "react";
import type { Project } from "@/data/projects";

type Diagram = NonNullable<Project["diagram"]>;

// Draws boxes joined by arrows from the project's diagram data.
// Down arrows on mobile, right arrows on desktop.
export default function FlowDiagram({ diagram, accent }: { diagram: Diagram; accent: string }) {
  return (
    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      {diagram.nodes.map((n, i) => (
        <Fragment key={n.label + i}>
          {i > 0 && (
            <span aria-hidden className="text-center font-mono text-muted">
              <span className="sm:hidden">↓</span>
              <span className="hidden sm:inline">→</span>
            </span>
          )}
          <div
            className="rounded-xl border bg-card px-4 py-3"
            style={{ borderColor: accent + "66" }}
          >
            <div className="font-mono text-sm">{n.label}</div>
            {n.sub && <div className="mt-0.5 text-xs text-muted">{n.sub}</div>}
          </div>
        </Fragment>
      ))}
    </div>
  );
}
