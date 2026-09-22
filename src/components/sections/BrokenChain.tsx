import { Button } from "@/components/ui/button";
import { Statement } from "@/components/site/Section";
import { cn } from "@/lib/utils";

const MANUAL = [
  { event: "A lead fills out a form.", cost: "Someone has to check it." },
  { event: "A new enquiry arrives.", cost: "Someone has to enter it into the CRM." },
  { event: "A customer sends a WhatsApp message.", cost: "Someone has to respond." },
  { event: "The customer disappears.", cost: "Someone has to remember the follow-up." },
  {
    event: "A meeting needs to be scheduled.",
    cost: "Five messages later, you finally find a time.",
  },
  { event: "The job is completed.", cost: "Someone should ask for a review. Often, nobody does." },
];

const AUTOMATED = ["Lead", "AI qualification", "CRM", "WhatsApp", "Follow-up", "Booking"];

export function BrokenChain() {
  return (
    <Statement
      id="solutions"
      rail="manual"
      title="How much of your business is still running manually?"
    >
      <ol className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
        {MANUAL.map((item) => (
          <li key={item.event} className="border-l border-dashed border-manual/60 pl-5">
            <p className="text-lg font-semibold leading-snug">{item.event}</p>
            <p className="mt-1 text-base text-manual">{item.cost}</p>
          </li>
        ))}
      </ol>

      <p className="mt-14 max-w-2xl text-xl font-semibold sm:text-2xl">
        These aren't six separate tasks.
      </p>
      <p className="mt-1 max-w-2xl text-xl text-muted-foreground sm:text-2xl">
        They're one system waiting to be automated.
      </p>

      <div className="mt-8">
        <ol
          className="flex flex-wrap items-center gap-y-2"
          aria-label="The same work as one system"
        >
          {AUTOMATED.map((step, index) => {
            const last = index === AUTOMATED.length - 1;
            return (
              <li key={step} className="flex items-center">
                <span
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm font-medium",
                    last
                      ? "border-success/50 bg-success/10 text-success"
                      : "border-border-strong bg-surface",
                  )}
                >
                  {step}
                </span>
                {last ? null : <span aria-hidden="true" className="h-px w-8 bg-brand-gradient" />}
              </li>
            );
          })}
        </ol>
      </div>

      <Button variant="outline" size="lg" className="mt-10" asChild>
        <a href="#automations">See what we automate</a>
      </Button>
    </Statement>
  );
}
