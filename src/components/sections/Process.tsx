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
    <section id="how-it-works" className="relative py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-5xl px-5 lg:px-8">
        <div>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            How we work together.
          </h2>
        </div>

        <ol className="mt-8 space-y-3 sm:mt-10">
          {STEPS.map((step, index) => (
            <li key={step.n}>
              <div className="flex gap-5 rounded-2xl border border-border bg-surface/60 p-6">
                <span className="text-sm font-bold text-primary">{step.n}</span>
                <div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
