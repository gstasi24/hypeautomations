import { Statement } from "@/components/site/Section";

const STEPS = [
  {
    title: "Free consultation",
    text: "We look at how your business currently handles leads, messages and follow-ups.",
  },
  {
    title: "Automation plan",
    text: "You get a clear picture of what can be automated first and what it changes.",
  },
  {
    title: "We build the system",
    text: "We connect your tools and build the workflows around your existing process.",
  },
  {
    title: "Testing and handover",
    text: "Everything is tested with real cases, then handed over with a walkthrough.",
  },
  {
    title: "Ongoing support",
    text: "Systems get adjusted as your business changes. You're not left alone with it.",
  },
];

const HOW_WE_WORK = [
  {
    title: "Built for your process",
    text: "No templates forced onto your business. Every system is built around how you already work.",
  },
  {
    title: "Clear communication",
    text: "You always know what is being built, what it does and what happens next.",
  },
  {
    title: "Your data stays yours",
    text: "We work inside your own tools and accounts. You keep ownership and access.",
  },
  {
    title: "Maintained, not abandoned",
    text: "Automations are adjusted as your tools, offers and team change.",
  },
];

export function HowItWorks() {
  return (
    <Statement
      id="how-it-works"
      rail="flow"
      title="How we work together."
      lead="Five steps, in order. You know what happens next at every one of them."
    >
      <ol className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((step, index) => (
          <li key={step.title} className="relative pl-12">
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 flex size-8 items-center justify-center rounded-full border border-border-strong text-sm font-semibold tabular-nums"
            >
              {index + 1}
            </span>
            <h3 className="text-lg font-semibold leading-snug">{step.title}</h3>
            <p className="mt-2 text-muted-foreground">{step.text}</p>
          </li>
        ))}
      </ol>

      <div className="mt-16 border-t border-border pt-10">
        <h3 className="type-title">How we work</h3>
        <ul className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {HOW_WE_WORK.map((point) => (
            <li key={point.title}>
              <p className="font-semibold">{point.title}</p>
              <p className="mt-1 text-muted-foreground">{point.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </Statement>
  );
}
