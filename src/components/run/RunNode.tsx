import { cn } from "@/lib/utils";
import type { RunStep } from "./run-steps";

export type RunNodeState = "waiting" | "running" | "done";

const STATUS_LABEL: Record<RunNodeState, string> = {
  waiting: "Waiting",
  running: "Running",
  done: "Done",
};

export function RunNode({
  step,
  state,
  last,
}: {
  step: RunStep;
  state: RunNodeState;
  last: boolean;
}) {
  const Icon = step.icon;
  const lit = state !== "waiting";

  return (
    <li>
      <div
        className={cn(
          "flex items-center gap-3 rounded-control border px-3 py-2.5 transition-colors duration-(--motion-state)",
          state === "running" && "border-primary bg-primary/10",
          state === "done" && "border-border-strong bg-surface-2/60",
          state === "waiting" && "border-border bg-surface-2/25",
        )}
      >
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-control transition-colors duration-(--motion-state)",
            state === "running" && "bg-brand-gradient text-primary-foreground",
            state === "done" && "bg-success/15 text-success",
            state === "waiting" && "bg-muted text-muted-foreground",
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className={cn("text-sm font-semibold", !lit && "text-muted-foreground")}>
            {step.event}
          </p>
          <p
            className={cn(
              "truncate text-xs transition-opacity duration-(--motion-state)",
              lit ? "text-muted-foreground" : "text-muted-foreground/60",
            )}
          >
            {step.detail}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium transition-colors duration-(--motion-state)",
            state === "running" && "bg-primary/25 text-link",
            state === "done" && "bg-success/15 text-success",
            state === "waiting" && "bg-muted text-muted-foreground",
          )}
        >
          {STATUS_LABEL[state]}
        </span>
      </div>

      {/* The run line: gradient only where automation has flowed */}
      {last ? null : (
        <div className="ml-[2.05rem] h-4 w-px overflow-hidden bg-border" aria-hidden="true">
          {state === "done" ? <span className="block h-full w-px bg-brand-gradient" /> : null}
          {state === "running" ? (
            <span className="block h-full w-px bg-brand-gradient animate-pulse-down" />
          ) : null}
        </div>
      )}
    </li>
  );
}
