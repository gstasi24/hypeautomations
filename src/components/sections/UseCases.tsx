import { useState } from "react";
import { Instrument } from "@/components/site/Section";
import { cn } from "@/lib/utils";

const CASES = [
  {
    label: "Service businesses",
    before: "Enquiries pile up in the inbox and get answered when someone finds time.",
    after: "Every enquiry is qualified, logged and answered instantly, with follow-ups queued.",
  },
  {
    label: "Agencies",
    before: "Client updates, onboarding and reporting are handled manually by the team.",
    after: "Onboarding, task creation and status updates run automatically from one trigger.",
  },
  {
    label: "E-commerce",
    before: "Order questions and post-purchase messages are answered one by one.",
    after: "Common questions are handled automatically; reviews are requested on schedule.",
  },
  {
    label: "Clinics and studios",
    before: "Booking and rescheduling happen over long message threads.",
    after: "Clients book, confirm and reschedule themselves; reminders reduce no-shows.",
  },
  {
    label: "B2B sales teams",
    before: "Leads sit untouched until a rep opens the CRM.",
    after: "Leads are scored, assigned and nurtured the moment they arrive.",
  },
];

export function UseCases() {
  const [active, setActive] = useState(0);
  const current = CASES[active]!;

  return (
    <Instrument
      rail="flow"
      title="What this looks like in your kind of business."
      lead="Example workflows, not client results."
    >
      <div role="tablist" aria-label="Business types" className="flex gap-2 overflow-x-auto pb-1">
        {CASES.map((item, index) => {
          const selected = active === index;
          return (
            <button
              key={item.label}
              type="button"
              role="tab"
              id={`case-tab-${index}`}
              aria-selected={selected}
              aria-controls="case-panel"
              onClick={() => setActive(index)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors duration-(--motion-micro)",
                selected
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        id="case-panel"
        role="tabpanel"
        aria-labelledby={`case-tab-${active}`}
        className="mt-8 grid gap-8 lg:grid-cols-2"
      >
        <div className="border-l border-dashed border-manual/60 pl-5">
          <p className="text-sm font-semibold text-manual">Today</p>
          <p className="mt-3 text-lg leading-snug text-manual">{current.before}</p>
        </div>
        <div className="relative pl-5">
          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-brand-gradient" />
          <p className="text-sm font-semibold">With automation</p>
          <p className="mt-3 text-lg font-medium leading-snug">{current.after}</p>
        </div>
      </div>
    </Instrument>
  );
}
