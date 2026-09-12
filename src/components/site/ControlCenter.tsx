import { useEffect, useState } from "react";
import { useInView } from "./Reveal";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  Bot,
  CalendarCheck,
  Database,
  MessageCircle,
  Send,
  UserPlus,
} from "lucide-react";

const NODES = [
  { label: "New Lead", icon: UserPlus, note: "New lead received" },
  { label: "AI Qualification", icon: Bot, note: "Lead qualified" },
  { label: "CRM", icon: Database, note: "CRM updated" },
  { label: "WhatsApp", icon: MessageCircle, note: "WhatsApp sent" },
  { label: "Follow-up", icon: Send, note: "Follow-up scheduled" },
  { label: "Booking", icon: CalendarCheck, note: "Meeting booked" },
];

const KPIS = [
  { label: "Active automations", value: "12", status: "Running" },
  { label: "New leads", value: "248", status: "Live" },
  { label: "Conversations", value: "186", status: "Active" },
  { label: "Appointments", value: "47", status: "Booked" },
];

export function ControlCenter({ compact = false }: { compact?: boolean }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25 });
  const [active, setActive] = useState(-1);

  useEffect(() => {
    if (!inView) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setActive(NODES.length - 1);
      return;
    }
    const interval = setInterval(() => {
      setActive((prev) => (prev >= NODES.length - 1 ? 0 : prev + 1));
    }, 1400);
    return () => clearInterval(interval);
  }, [inView]);

  const complete = active >= NODES.length - 1;

  return (
    <div ref={ref} className="relative">
      <div className="brand-glow -bottom-16 left-1/2 h-64 w-[80%] -translate-x-1/2 opacity-70" />

      <div className="relative rounded-3xl border border-border bg-surface/80 p-4 backdrop-blur-xl glow-ring sm:p-6">
        <div className="flex items-center justify-between">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Automation control center
          </p>
          <span className="flex items-center gap-1.5 rounded-full border border-success/40 bg-success/10 px-2.5 py-1 text-[0.65rem] font-medium text-success">
            <span className="size-1.5 rounded-full bg-success animate-breathe" /> Running
          </span>
        </div>

        {/* KPI tiles */}
        <div className={cn("mt-4 grid gap-2", compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4")}>
          {KPIS.map((kpi) => (
            <div key={kpi.label} className="rounded-2xl border border-border bg-surface-2/70 p-3">
              <p className="text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                {kpi.label}
              </p>
              <p className="mt-1 text-xl font-bold">{kpi.value}</p>
              <p className="text-[0.6rem] text-accent">{kpi.status}</p>
            </div>
          ))}
        </div>

        {/* Workflow */}
        <ol className="mt-5 space-y-1.5">
          {NODES.map((node, index) => {
            const isActive = index === active;
            const isDone = index < active || complete;
            const Icon = node.icon;
            return (
              <li key={node.label}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border px-3 py-2.5 transition-all duration-500",
                    isActive
                      ? "border-primary/70 bg-primary/12 shadow-[0_0_28px_-12px_var(--color-primary)]"
                      : isDone
                        ? "border-border-strong bg-surface-2/60"
                        : "border-border bg-surface-2/25",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-500",
                      isActive || isDone
                        ? "bg-brand-gradient text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{node.label}</p>
                    <p
                      className={cn(
                        "truncate text-[0.7rem] transition-opacity duration-500",
                        isActive || isDone ? "text-accent opacity-100" : "text-muted-foreground opacity-60",
                      )}
                    >
                      {node.note}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wider transition-colors duration-500",
                      isActive
                        ? "bg-primary/25 text-secondary"
                        : isDone
                          ? "bg-success/15 text-success"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {isActive ? "Running" : isDone ? "Done" : "Idle"}
                  </span>
                </div>

                {index < NODES.length - 1 ? (
                  <div className="ml-[2.05rem] h-4 w-px overflow-hidden bg-border">
                    {index === active ? (
                      <span className="block h-full w-px bg-accent animate-pulse-down" />
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>

        <div
          className={cn(
            "mt-4 flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition-all duration-700",
            complete
              ? "border-success/50 bg-success/10"
              : "border-border bg-surface-2/40 opacity-70",
          )}
        >
          <p className="text-sm font-semibold">
            {complete ? "Meeting booked" : "Workflow in progress"}
          </p>
          <BadgeCheck className={cn("size-5", complete ? "text-success" : "text-muted-foreground")} />
        </div>

        <p className="mt-3 text-[0.62rem] text-muted-foreground">
          Illustrative demo interface. Figures are examples, not client results.
        </p>
      </div>
    </div>
  );
}
