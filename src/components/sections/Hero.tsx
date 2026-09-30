import { Button } from "@/components/ui/button";
import { Run } from "@/components/run/Run";
import { useBooking } from "@/components/booking/BookingProvider";

export function Hero() {
  const { openBooking } = useBooking();

  return (
    <section id="top" className="relative overflow-hidden pb-12 pt-24 sm:pb-16 lg:pb-20 lg:pt-32">
      <div
        className="brand-glow -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 opacity-55"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-link">Hype Custom Workflows</p>
          <h1 className="type-display mt-5">Automate smarter. Build exactly what your business needs.</h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Custom AI-powered workflows designed around the way your business actually operates.
            Connect tools, remove repetitive work and build automated processes across sales,
            operations, customer service and internal workflows.
          </p>

          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Button size="lg" onClick={openBooking}>
              Book a Consultation
            </Button>
            <Button variant="link" size="lg" className="px-0" asChild>
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Private AI is one operator across your business. Custom Workflows automate a specific process end to end.
          </p>
        </div>

        <div className="min-w-0 lg:pl-4">
          <Run />
        </div>
      </div>
    </section>
  );
}
