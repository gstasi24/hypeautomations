import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/private-ai/analytics";
import { cn } from "@/lib/utils";
import {
  Mail,
  CalendarDays,
  HardDrive,
  Users,
  MessageSquare,
  FileText,
  ListChecks,
  CreditCard,
  Check,
} from "lucide-react";

const TOOLS = [
  { label: "Gmail", icon: Mail },
  { label: "Calendar", icon: CalendarDays },
  { label: "Drive", icon: HardDrive },
  { label: "CRM", icon: Users },
  { label: "Slack", icon: MessageSquare },
  { label: "Documents", icon: FileText },
  { label: "Tasks", icon: ListChecks },
  { label: "Stripe", icon: CreditCard },
];
const STAGES = ["Command", "Understand", "Check tools", "Prepare", "Request approval", "Action ready"];

export function ProductHero() {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    track("private_ai_hero_view");
    const t = setInterval(() => setStage((s) => (s + 1) % (STAGES.length + 2)), 1400);
    return () => clearInterval(t);
  }, []);
  const s = Math.min(stage, STAGES.length - 1);

  return (
    <section id="top" className="relative overflow-hidden pb-12 pt-28 lg:pb-20 lg:pt-36">
      <div className="brand-glow -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 opacity-55" aria-hidden />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:px-8">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-link">
            Your private AI operator
          </p>
          <h1 className="type-display mt-5">
            One AI. Your tools. <span className="text-gradient">Your business.</span>
          </h1>
          <p className="mt-5 text-xl font-medium">Just tell it what needs to happen.</p>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
            A private AI agent designed around your business, connected to the tools you approve.
            It keeps context over time and asks for your approval where it matters.
          </p>
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Button size="lg" asChild onClick={() => track("private_ai_cta_click", { cta: "hero_choose" })}>
              <a href="#pricing">Choose Your AI</a>
            </Button>
            <Button variant="link" size="lg" className="px-0" asChild>
              <a href="#what-it-does">See What It Can Do</a>
            </Button>
          </div>
        </div>

        <div className="min-w-0">
          <div className="relative rounded-panel border border-border bg-surface/80 p-5 glow-ring sm:p-6">
            {/* Core + tools */}
            <div className="relative mx-auto grid grid-cols-4 gap-2 sm:gap-3">
              {TOOLS.slice(0, 4).map((t, i) => (
                <ToolChip key={t.label} {...t} active={s >= 2} delay={i} />
              ))}
              <div className="col-span-4 flex items-center justify-center py-3">
                <div className="relative flex size-20 items-center justify-center rounded-full border border-border-strong bg-background">
                  <span className="absolute inset-0 animate-breathe rounded-full bg-brand-gradient opacity-30 blur-md" />
                  <span className="relative size-9 rounded-full bg-brand-gradient" />
                </div>
              </div>
              {TOOLS.slice(4).map((t, i) => (
                <ToolChip key={t.label} {...t} active={s >= 2} delay={i + 4} />
              ))}
            </div>

            {/* Stages */}
            <ol className="mt-5 flex flex-wrap gap-1.5" aria-label="How a request runs">
              {STAGES.map((label, i) => (
                <li
                  key={label}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors duration-300",
                    i < s && "border-primary/40 text-foreground",
                    i === s && "border-transparent bg-brand-gradient text-primary-foreground",
                    i > s && "border-border text-muted-foreground",
                  )}
                >
                  {label}
                </li>
              ))}
            </ol>

            {/* Conversation (illustrative) */}
            <div className="mt-5 space-y-3 text-sm">
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-surface-2 px-4 py-3">
                Give me my priorities for today and move anything non-urgent to tomorrow.
              </div>
              <div
                className={cn(
                  "max-w-[90%] rounded-2xl rounded-bl-md border border-border bg-background px-4 py-3 transition-opacity duration-500",
                  s >= 4 ? "opacity-100" : "opacity-30",
                )}
              >
                I found 3 priority items, 2 meetings and 4 pending follow-ups. I've prepared the
                changes. Review before I apply them?
                <div className="mt-3 flex gap-2">
                  <span className="rounded-control border border-border px-3 py-1.5 text-xs">Review actions</span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-control px-3 py-1.5 text-xs",
                      s >= 5 ? "bg-success text-success-foreground" : "bg-primary-fill text-primary-foreground",
                    )}
                  >
                    {s >= 5 && <Check className="size-3" />} Approve
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-[11px] text-muted-foreground">Illustrative example of the planned experience.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ToolChip({
  label,
  icon: Icon,
  active,
  delay,
}: {
  label: string;
  icon: typeof Mail;
  active: boolean;
  delay: number;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-control border px-1 py-2.5 text-[11px] transition-all duration-500",
        active ? "border-primary/40 text-foreground" : "border-border text-muted-foreground",
      )}
      style={{ transitionDelay: `${delay * 60}ms` }}
    >
      <Icon className={cn("size-4", active ? "text-link" : "")} />
      {label}
    </div>
  );
}
