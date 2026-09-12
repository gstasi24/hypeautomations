import { Reveal } from "@/components/site/Reveal";

const STEPS = [
  {
    n: "01",
    title: "Free consultation",
    text: "We look at how your business currently handles leads, messages and follow-ups.",
  },
  {
    n: "02",
    title: "Automation plan",
    text: "You get a clear picture of what can be automated first and what it changes.",
  },
  {
    n: "03",
    title: "We build the system",
    text: "We connect your tools and build the workflows around your existing process.",
  },
  {
    n: "04",
    title: "Testing & handover",
    text: "Everything is tested with real cases, then handed over with a walkthrough.",
  },
  {
    n: "05",
    title: "Ongoing support",
    text: "Systems get adjusted as your business changes. You're not left alone with it.",
  },
];

export function Process() {
  return (
    <section className="relative py-20 lg:py-28">
      <div className="mx-auto w-full max-w-5xl px-5 lg:px-8">
        <Reveal>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            How we <span className="text-gradient">work together.</span>
          </h2>
        </Reveal>

        <ol className="mt-12 space-y-3">
          {STEPS.map((step, index) => (
            <Reveal as="li" key={step.n} delay={index * 80}>
              <div className="flex gap-5 rounded-2xl border border-border bg-surface/60 p-6">
                <span className="text-sm font-bold tracking-[0.2em] text-primary">{step.n}</span>
                <div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
