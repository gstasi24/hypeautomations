import { Button } from "@/components/ui/button";

const CARDS = [
  { n: "01", top: "A lead fills out a form.", bottom: "Someone has to check it." },
  { n: "02", top: "A new enquiry arrives.", bottom: "Someone has to enter it into the CRM." },
  { n: "03", top: "A customer sends a WhatsApp message.", bottom: "Someone has to respond." },
  { n: "04", top: "The customer disappears.", bottom: "Someone has to remember the follow-up." },
  {
    n: "05",
    top: "A meeting needs to be scheduled.",
    bottom: "Five messages later, you finally find a time.",
  },
  {
    n: "06",
    top: "The job is completed.",
    bottom: "Someone should ask for a review. Often, nobody does.",
  },
];

export function Problem() {
  return (
    <section id="solutions" className="relative py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
        <div>
          <h2 className="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            How much of your business is still running manually?
          </h2>
        </div>

        <ul className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card, index) => (
            <li key={card.n}>
              <div className="group h-full rounded-2xl border border-border bg-surface/60 p-6 transition-all duration-400 hover:border-primary/50 hover:bg-surface">
                <p className="text-xs font-bold text-primary">{card.n}</p>
                <p className="mt-4 text-lg font-semibold leading-snug">{card.top}</p>
                <p className="mt-2 text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                  {card.bottom}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div>
          <div className="mt-8 rounded-3xl border border-border bg-surface/50 p-7 sm:mt-10 sm:p-10">
            <p className="text-xl font-semibold sm:text-2xl">These aren't six separate tasks.</p>
            <p className="mt-2 text-xl text-muted-foreground sm:text-2xl">
              They're one system waiting to be automated.
            </p>
            <Button variant="outline" size="lg" className="mt-7" asChild>
              <a href="#automations">See what we automate</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
