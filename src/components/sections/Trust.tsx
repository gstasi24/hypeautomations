import { Reveal } from "@/components/site/Reveal";
import { Handshake, Lock, PenTool, Wrench } from "lucide-react";

const POINTS = [
  {
    icon: PenTool,
    title: "Built for your process",
    text: "No templates forced onto your business. Every system is built around how you already work.",
  },
  {
    icon: Handshake,
    title: "Clear communication",
    text: "You always know what is being built, what it does and what happens next.",
  },
  {
    icon: Lock,
    title: "Your data stays yours",
    text: "We work inside your own tools and accounts. You keep ownership and access.",
  },
  {
    icon: Wrench,
    title: "Maintained, not abandoned",
    text: "Automations are adjusted as your tools, offers and team change.",
  },
];

export function Trust() {
  return (
    <section className="relative py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
        <Reveal>
          <h2 className="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Why businesses choose to work <span className="text-gradient">with us.</span>
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2">
          {POINTS.map((point, index) => {
            const Icon = point.icon;
            return (
              <Reveal key={point.title} delay={index * 80}>
                <div className="h-full rounded-2xl border border-border bg-surface/60 p-6 sm:p-7">
                  <span className="flex size-11 items-center justify-center rounded-xl border border-border-strong bg-surface-2 text-accent">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{point.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{point.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
