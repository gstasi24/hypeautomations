import { useEffect, useState } from "react";
import { useInView } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/components/booking/BookingProvider";
import { cn } from "@/lib/utils";

const STEPS = [
  { time: "0s", title: "A new lead arrives", detail: "Website form submitted" },
  {
    time: "1s",
    title: "AI reads and qualifies the enquiry",
    detail: "Intent, budget and urgency detected",
  },
  {
    time: "2s",
    title: "The CRM is updated automatically",
    detail: "Contact created, stage set to Qualified",
  },
  {
    time: "3s",
    title: "The customer receives an instant WhatsApp reply",
    detail: "Personalised, in your tone of voice",
  },
  {
    time: "4s",
    title: "A follow-up is scheduled",
    detail: "No reply? Reminder queued for tomorrow",
  },
  { time: "5s", title: "The meeting is booked", detail: "Calendar invite sent to both sides" },
];

export function LiveWorkflow() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const [visible, setVisible] = useState(0);
  const { openBooking } = useBooking();

  useEffect(() => {
    if (!inView) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVisible(STEPS.length);
      return;
    }
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setVisible(current);
      if (current >= STEPS.length) clearInterval(interval);
    }, 450);
    return () => clearInterval(interval);
  }, [inView]);

  return (
    <section id="how-it-works" className="relative py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-5xl px-5 lg:px-8">
        <div>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            This is what happens while you're busy.
          </h2>
          <p className="mt-5 max-w-xl text-muted-foreground">
            One enquiry, handled end to end — without anyone touching a keyboard.
          </p>
        </div>

        <div ref={ref} className="mt-8 space-y-2.5 sm:mt-10">
          {STEPS.map((step, index) => {
            const shown = index < visible;
            return (
              <div
                key={step.title}
                className={cn(
                  "flex items-start gap-4 rounded-2xl border border-border bg-surface/60 p-4 transition-all duration-600 sm:p-5",
                  shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                )}
              >
                <span className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-xl border border-border-strong bg-surface-2 text-xs font-bold text-accent">
                  {step.time}
                </span>
                <div>
                  <p className="text-base font-semibold sm:text-lg">{step.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{step.detail}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div>
          <div className="mt-8 rounded-3xl border border-primary/40 bg-surface/70 p-7 sm:p-9">
            <p className="text-xl font-semibold sm:text-2xl">
              Six steps. Zero manual work. Every single time.
            </p>
            <Button size="lg" className="mt-6" onClick={openBooking}>
              Book a free consultation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
