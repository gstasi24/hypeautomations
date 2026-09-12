import { useState } from "react";
import { Reveal } from "@/components/site/Reveal";
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
    label: "Clinics & studios",
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
    <section className="relative py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
        <Reveal>
          <h2 className="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            What this looks like in <span className="text-gradient">your kind of business.</span>
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <div
            role="tablist"
            aria-label="Business types"
            className="mt-8 flex gap-2 overflow-x-auto pb-2 sm:mt-10"
          >
            {CASES.map((item, index) => (
              <button
                key={item.label}
                role="tab"
                aria-selected={active === index}
                onClick={() => setActive(index)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition-all",
                  active === index
                    ? "border-primary/60 bg-primary/15 text-foreground"
                    : "border-border bg-surface/60 text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface/40 p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
                Today
              </p>
              <p className="mt-4 text-lg leading-snug text-muted-foreground">{current.before}</p>
            </div>
            <div className="rounded-2xl border border-primary/40 bg-surface/70 p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-secondary">
                With automation
              </p>
              <p className="mt-4 text-lg font-medium leading-snug">{current.after}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
