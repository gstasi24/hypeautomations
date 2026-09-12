import { useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";
import {
  Bot,
  CalendarClock,
  Headphones,
  MessageCircle,
  Settings2,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

const CATEGORIES = [
  {
    n: "01",
    title: "Lead Management",
    icon: Users,
    items: ["Lead capture", "Qualification", "Lead routing", "CRM updates", "Lead scoring"],
    flow: ["Form", "AI check", "CRM", "Owner alert"],
  },
  {
    n: "02",
    title: "WhatsApp",
    icon: MessageCircle,
    items: ["Instant responses", "Qualification", "Follow-ups", "Reminders", "Notifications"],
    flow: ["Message", "AI reply", "Qualify", "Handover"],
  },
  {
    n: "03",
    title: "Sales",
    icon: TrendingUp,
    items: [
      "Automated follow-ups",
      "Lead nurturing",
      "Pipeline updates",
      "Sales notifications",
      "Lead assignment",
    ],
    flow: ["Lead", "Assign", "Nurture", "Pipeline"],
  },
  {
    n: "04",
    title: "Appointments",
    icon: CalendarClock,
    items: ["Scheduling", "Confirmation", "Reminders", "Rescheduling", "No-show follow-up"],
    flow: ["Request", "Slot", "Confirm", "Remind"],
  },
  {
    n: "05",
    title: "Customer Support",
    icon: Headphones,
    items: [
      "Request classification",
      "Routing",
      "FAQ responses",
      "Notifications",
      "Ticket creation",
    ],
    flow: ["Request", "Classify", "Route", "Resolve"],
  },
  {
    n: "06",
    title: "Reputation",
    icon: Star,
    items: [
      "Review requests",
      "Feedback collection",
      "Review reminders",
      "Customer satisfaction workflows",
    ],
    flow: ["Job done", "Ask", "Remind", "Collect"],
  },
  {
    n: "07",
    title: "Operations",
    icon: Settings2,
    items: [
      "Documents",
      "Database updates",
      "Internal notifications",
      "Reporting",
      "Data synchronization",
    ],
    flow: ["Trigger", "Update", "Notify", "Report"],
  },
  {
    n: "08",
    title: "AI",
    icon: Bot,
    items: [
      "Data extraction",
      "Classification",
      "Summaries",
      "Response generation",
      "Intelligent routing",
    ],
    flow: ["Input", "Understand", "Decide", "Act"],
  },
];

export function WhatWeAutomate() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="automations" className="relative py-20 lg:py-28">
      <div className="brand-glow left-0 top-1/4 h-72 w-72 opacity-30" />
      <div className="relative mx-auto w-full max-w-7xl px-5 lg:px-8">
        <Reveal>
          <h2 className="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            What could your business <span className="text-gradient">stop doing manually?</span>
          </h2>
          <p className="mt-5 max-w-xl text-muted-foreground">
            We build systems around the tools and processes you already use.
          </p>
        </Reveal>

        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category, index) => {
            const Icon = category.icon;
            const expanded = openIndex === index;
            return (
              <Reveal as="li" key={category.n} delay={index * 60}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(expanded ? null : index)}
                  aria-expanded={expanded}
                  className={cn(
                    "group h-full w-full rounded-2xl border border-border bg-surface/60 p-5 text-left transition-all duration-400",
                    "hover:border-primary/50 hover:bg-surface hover:shadow-[0_18px_50px_-24px_var(--color-primary)]",
                    expanded && "border-primary/60 bg-surface",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-xl border border-border-strong bg-surface-2 text-accent">
                      <Icon className="size-5" />
                    </span>
                    <span className="text-[0.65rem] font-bold tracking-[0.2em] text-muted-foreground">
                      {category.n}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-semibold uppercase tracking-wide">
                    {category.title}
                  </h3>

                  <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                    {category.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div
                    className={cn(
                      "grid transition-all duration-500 lg:group-hover:grid-rows-[1fr] lg:group-hover:opacity-100",
                      expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-border pt-4">
                        {category.flow.map((step, stepIndex) => (
                          <span key={step} className="flex items-center gap-1.5">
                            <span className="rounded-lg bg-surface-2 px-2 py-1 text-[0.65rem] font-medium text-foreground">
                              {step}
                            </span>
                            {stepIndex < category.flow.length - 1 ? (
                              <span className="text-accent">→</span>
                            ) : null}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-[0.65rem] uppercase tracking-widest text-muted-foreground lg:hidden">
                    {expanded ? "Tap to close" : "Tap to see the workflow"}
                  </p>
                </button>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
