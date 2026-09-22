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
        <div>
          <h1 className="text-balance text-[clamp(2.5rem,1rem+6vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.035em]">
            We automate the work you shouldn't be doing manually.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            We connect AI, WhatsApp, your CRM, email and the tools you already use, so leads,
            replies, follow-ups and bookings happen without anyone doing them by hand.
          </p>

          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Button size="lg" onClick={openBooking}>
              Book a free consultation
            </Button>
            <Button variant="link" size="lg" className="px-0" asChild>
              <a href="#how-it-works">See how it works</a>
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Free, no commitment. We look at your process and show you what could run on its own.
          </p>
        </div>

        <div className="lg:pl-4">
          <Run />
        </div>
      </div>
    </section>
  );
}
