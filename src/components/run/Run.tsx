import { useCallback, useEffect, useRef, useState } from "react";
import { BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExampleTag } from "@/components/site/ExampleTag";
import { useInView } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";
import { RunNode, type RunNodeState } from "./RunNode";
import { RUN_STEPS, RUN_STEP_MS } from "./run-steps";

type Phase = "idle" | "running" | "done";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * The signature element: one example lead moving from form to booked meeting.
 * Plays once when first seen, again on request, and pauses while off screen.
 * With reduced motion it renders the finished run immediately.
 */
export function Run() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.35, once: false });
  const [phase, setPhase] = useState<Phase>("idle");
  const [active, setActive] = useState(-1);
  const [announcement, setAnnouncement] = useState("");
  const started = useRef(false);

  const start = useCallback(() => {
    setAnnouncement("");
    if (prefersReducedMotion()) {
      setActive(RUN_STEPS.length);
      setPhase("done");
      setAnnouncement("Example run complete: meeting booked.");
      return;
    }
    setActive(0);
    setPhase("running");
  }, []);

  // Play once on first view
  useEffect(() => {
    if (inView && !started.current) {
      started.current = true;
      start();
    }
  }, [inView, start]);

  // Advance while running and on screen; pause off screen
  useEffect(() => {
    if (phase !== "running" || !inView) return;
    const timer = setInterval(() => {
      setActive((current) => {
        const next = current + 1;
        if (next >= RUN_STEPS.length) {
          clearInterval(timer);
          setPhase("done");
          setAnnouncement("Example run complete: meeting booked.");
          return RUN_STEPS.length;
        }
        return next;
      });
    }, RUN_STEP_MS);
    return () => clearInterval(timer);
  }, [phase, inView]);

  const done = phase === "done";

  return (
    <div ref={ref} className="relative">
      <div className="relative rounded-panel border border-border bg-surface/80 p-4 backdrop-blur-xl sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold">One lead, handled end to end</p>
          <ExampleTag />
        </div>

        <ol className="mt-4 space-y-1.5">
          {RUN_STEPS.map((step, index) => {
            const state: RunNodeState =
              index < active ? "done" : index === active ? "running" : "waiting";
            return (
              <RunNode
                key={step.event}
                step={step}
                state={state}
                last={index === RUN_STEPS.length - 1}
              />
            );
          })}
        </ol>

        <div
          className={cn(
            "mt-4 flex items-center justify-between gap-3 rounded-control border px-4 py-3 transition-colors duration-(--motion-state)",
            done ? "border-success/50 bg-success/10" : "border-border bg-surface-2/40",
          )}
        >
          <p className={cn("text-sm font-semibold", !done && "text-muted-foreground")}>
            {done ? "Meeting booked" : phase === "running" ? "Running" : "Waiting for a lead"}
          </p>
          <BadgeCheck
            className={cn("size-5", done ? "text-success" : "text-muted-foreground")}
            aria-hidden="true"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          className="mt-4 w-full sm:w-auto"
          onClick={start}
          disabled={phase === "running"}
        >
          {phase === "idle"
            ? "Send a test lead"
            : phase === "running"
              ? "Running…"
              : "Run it again"}
        </Button>

        <p aria-live="polite" className="sr-only">
          {announcement}
        </p>
      </div>
    </div>
  );
}
