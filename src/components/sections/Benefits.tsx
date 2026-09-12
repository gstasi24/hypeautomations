import { Reveal } from "@/components/site/Reveal";
import { Clock, Gauge, Layers, ShieldCheck, Sparkles, Timer } from "lucide-react";

const BENEFITS = [
  {
    icon: Clock,
    title: "Time back",
    text: "Repetitive tasks stop landing on your team's to-do list.",
  },
  {
    icon: Timer,
    title: "Faster response",
    text: "Enquiries get answered in seconds, not hours.",
  },
  {
    icon: ShieldCheck,
    title: "Fewer missed opportunities",
    text: "Nothing gets forgotten because a person was busy.",
  },
  {
    icon: Gauge,
    title: "More control",
    text: "You can see what happens at every step of the process.",
  },
  {
    icon: Layers,
    title: "Scalability",
    text: "More volume no longer means more manual work.",
  },
  {
    icon: Sparkles,
    title: "Consistency",
    text: "Every customer gets the same quality of follow-up.",
  },
];

export function Benefits() {
  return (
    <section className="relative py-20 lg:py-28">
      <div className="brand-glow right-0 top-1/3 h-72 w-72 opacity-30" />
      <div className="relative mx-auto w-full max-w-7xl px-5 lg:px-8">
        <Reveal>
          <h2 className="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            What changes once your business{" "}
            <span className="text-gradient">runs on systems.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Reveal key={benefit.title} delay={index * 70}>
                <div className="h-full rounded-2xl border border-border bg-surface/60 p-6 transition-all duration-400 hover:-translate-y-1 hover:border-primary/50">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-brand-gradient text-primary-foreground">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{benefit.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{benefit.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
