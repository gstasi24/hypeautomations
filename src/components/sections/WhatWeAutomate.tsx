import { useState } from "react";
import { Instrument } from "@/components/site/Section";
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
    title: "Lead management",
    icon: Users,
    items: ["Lead capture", "Qualification", "Lead routing", "CRM updates", "Lead scoring"],
    flow: ["Form", "AI check", "CRM", "Owner alert"],
  },
  {
    title: "WhatsApp",
    icon: MessageCircle,
    items: ["Instant responses", "Qualification", "Follow-ups", "Reminders", "Notifications"],
    flow: ["Message", "AI reply", "Qualify", "Handover"],
  },
  {
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
    title: "Appointments",
    icon: CalendarClock,
    items: ["Scheduling", "Confirmation", "Reminders", "Rescheduling", "No-show follow-up"],
    flow: ["Request", "Slot", "Confirm", "Remind"],
  },
  {
    title: "Customer support",
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
    title: "Operations",
    icon: Settings2,
    items: [
      "Documents",
      "Database updates",
      "Internal notifications",
      "Reporting",
      "Data synchronisation",
    ],
    flow: ["Trigger", "Update", "Notify", "Report"],
  },
  {
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

const BENEFITS = [
  { title: "Time back", text: "Repetitive tasks stop landing on your team's to-do list." },
  { title: "Faster response", text: "Enquiries get answered in seconds, not hours." },
  {
    title: "Fewer missed opportunities",
    text: "Nothing gets forgotten because a person was busy.",
  },
  { title: "More control", text: "You can see what happens at every step of the process." },
  { title: "Scalability", text: "More volume no longer means more manual work." },
  { title: "Consistency", text: "Every customer gets the same quality of follow-up." },
];

export function WhatWeAutomate() {
  const [active, setActive] = useState(0);
  const current = CATEGORIES[active]!;
  const Icon = current.icon;

  return (
    <Instrument
      id="automations"
      rail="flow"
      title="What could your business stop doing manually?"
      lead="Pick an area. We build these around the tools and processes you already use."
      after={
        <div className="mt-14">
          <h3 className="type-title">What changes once it runs</h3>
          <ul className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <li key={benefit.title}>
                <p className="font-semibold">{benefit.title}</p>
                <p className="mt-1 text-muted-foreground">{benefit.text}</p>
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[15rem_1fr] lg:gap-10">
        <div
          role="tablist"
          aria-label="Areas we automate"
          className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
        >
          {CATEGORIES.map((category, index) => {
            const TabIcon = category.icon;
            const selected = active === index;
            return (
              <button
                key={category.title}
                type="button"
                role="tab"
                id={`area-tab-${index}`}
                aria-selected={selected}
                aria-controls="area-panel"
                onClick={() => setActive(index)}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-control border px-3.5 py-2.5 text-left text-sm font-medium transition-colors duration-(--motion-micro)",
                  selected
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
                )}
              >
                <TabIcon className="size-4 shrink-0" aria-hidden="true" />
                {category.title}
              </button>
            );
          })}
        </div>

        <div
          id="area-panel"
          role="tabpanel"
          aria-labelledby={`area-tab-${active}`}
          className="min-w-0"
        >
          <h3 className="type-title flex items-center gap-3">
            <Icon className="size-5 text-link" aria-hidden="true" />
            {current.title}
          </h3>

          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {current.items.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span
                  className="mt-2.5 size-1.5 shrink-0 rounded-full bg-link"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>

          <p className="mt-8 text-sm text-muted-foreground">How it runs</p>
          <ol className="mt-3 flex flex-wrap items-center gap-y-2">
            {current.flow.map((step, index) => {
              const last = index === current.flow.length - 1;
              return (
                <li key={step} className="flex items-center">
                  <span className="rounded-full border border-border-strong bg-surface-2 px-3 py-1 text-sm font-medium">
                    {step}
                  </span>
                  {last ? null : <span aria-hidden="true" className="h-px w-6 bg-brand-gradient" />}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </Instrument>
  );
}
