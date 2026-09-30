import { ArrowRight, Bell, CreditCard, Database, Mail, RefreshCw } from "lucide-react";
import { Instrument } from "@/components/site/Section";

const STEPS = [
  { label: "Stripe", detail: "Overdue invoice trigger", icon: CreditCard },
  { label: "CRM lookup", detail: "Find the customer record", icon: Database },
  { label: "Email draft", detail: "Generate a personalised reminder", icon: Mail },
  { label: "Sequence", detail: "Schedule follow-ups", icon: RefreshCw },
  { label: "CRM update", detail: "Record the latest status", icon: Database },
  { label: "Notification", detail: "Alert the right team member", icon: Bell },
];

export function CustomWorkflowExample() {
  return (
    <Instrument
      id="workflow-example"
      rail="flow"
      title="One trigger. One connected workflow. No manual chasing."
      lead="A purpose-built automation moves a specific process across the systems involved."
      className="scroll-mt-20"
    >
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Overdue invoice workflow example">
        {STEPS.map((step, index) => (
          <li key={`${step.label}-${index}`} className="relative flex min-w-0 items-start gap-3 rounded-control border border-border bg-background p-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-surface-2 text-link">
              <step.icon className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{step.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.detail}</p>
            </div>
            {index < STEPS.length - 1 ? <ArrowRight className="absolute -bottom-3 left-1/2 z-10 size-4 -translate-x-1/2 rotate-90 text-link sm:hidden" aria-hidden="true" /> : null}
          </li>
        ))}
      </ol>
      <p className="mt-5 text-xs text-muted-foreground">Illustrative workflow. The final system is scoped around your tools and operating rules.</p>
    </Instrument>
  );
}