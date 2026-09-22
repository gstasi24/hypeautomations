import { Button } from "@/components/ui/button";
import { ControlCenter } from "@/components/site/ControlCenter";
import { useBooking } from "@/components/booking/BookingProvider";

export function Hero() {
  const { openBooking } = useBooking();

  return (
    <section id="top" className="relative overflow-hidden pb-12 pt-24 sm:pb-16 lg:pb-20 lg:pt-32">
      <div className="brand-glow -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 opacity-55" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/70 px-3.5 py-1.5 text-xs font-semibold text-secondary">
            AI Automation Systems
          </span>

          <h1 className="mt-6 text-[2.6rem] font-extrabold leading-[1.05] sm:text-6xl lg:text-[4.1rem]">
            We automate the work
            <br />
            you shouldn't be doing manually.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            We connect AI, WhatsApp, CRM, email and the tools your business already uses to turn
            repetitive work into intelligent automated systems.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="h-13 px-7 text-base" onClick={openBooking}>
              Book a free consultation
            </Button>
            <Button size="lg" variant="outline" className="h-13 px-7 text-base" asChild>
              <a href="#how-it-works">See how it works</a>
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            No commitment. Let's identify what your business can automate.
          </p>

          <p className="mt-8 text-xs text-muted-foreground">
            Custom systems <span className="text-primary">•</span> Human support{" "}
            <span className="text-primary">•</span> Built around your existing tools
          </p>
        </div>

        <div className="lg:pl-4">
          <ControlCenter />
        </div>
      </div>
    </section>
  );
}
