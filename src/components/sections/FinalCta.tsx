import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/components/booking/BookingProvider";
import { ArrowRight, CalendarCheck, Clock, MessageSquare } from "lucide-react";

const EXPECT = [
  { icon: Clock, text: "30 minutes, online, no preparation needed" },
  { icon: MessageSquare, text: "We map your current process together" },
  { icon: CalendarCheck, text: "You leave with a concrete automation plan" },
];

export function FinalCta() {
  const { openBooking } = useBooking();

  return (
    <section id="consultation" className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="brand-glow left-1/2 top-1/4 h-[420px] w-[680px] -translate-x-1/2 opacity-50" />
      <div className="relative mx-auto w-full max-w-4xl px-5 text-center lg:px-8">
        <Reveal>
          <h2 className="text-3xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl">
            Let's find out what your business{" "}
            <span className="text-gradient">no longer has to do manually.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground sm:text-lg">
            Book a free consultation. We'll look at your process and show you what a system could
            handle for you.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="mx-auto mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
            {EXPECT.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.text}
                  className="rounded-2xl border border-border bg-surface/60 p-5 text-left"
                >
                  <Icon className="size-5 text-accent" />
                  <p className="mt-3 text-sm text-muted-foreground">{item.text}</p>
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <Button size="lg" className="mt-10 h-14 px-8 text-base" onClick={openBooking}>
            Book My Free Consultation <ArrowRight className="size-4" />
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            Free, no commitment, and you'll get value even if we never work together.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
