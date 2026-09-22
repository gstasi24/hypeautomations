import { Button } from "@/components/ui/button";
import { useBooking } from "@/components/booking/BookingProvider";
import { CalendarCheck, Clock, MessageSquare } from "lucide-react";

const EXPECT = [
  { icon: Clock, text: "30 minutes, online, no preparation needed" },
  { icon: MessageSquare, text: "We map your current process together" },
  { icon: CalendarCheck, text: "You leave with a concrete automation plan" },
];

/** The end of the run: the one centred, green moment on the page. */
export function FinalCta() {
  const { openBooking } = useBooking();

  return (
    <section id="consultation" className="relative overflow-hidden py-20 lg:py-28">
      <div
        className="brand-glow left-1/2 top-1/4 h-[420px] w-[680px] -translate-x-1/2 opacity-50"
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-3xl px-5 text-center lg:px-8">
        <div aria-hidden="true" className="flex flex-col items-center">
          <span className="block h-16 w-px bg-success" />
          <span className="size-2.5 rounded-full bg-success" />
        </div>

        <h2 className="type-statement mt-8">
          Let's find out what your business no longer has to do manually.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Book a free consultation. We look at your process and show you what a system could handle
          for you.
        </p>

        <ul className="mx-auto mt-10 grid max-w-2xl gap-4 text-left sm:grid-cols-3">
          {EXPECT.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.text} className="flex gap-3">
                <Icon className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </li>
            );
          })}
        </ul>

        <Button size="lg" className="mt-10" onClick={openBooking}>
          Book a free consultation
        </Button>
        <p className="mt-4 text-sm text-muted-foreground">
          Free, no commitment. You leave with a plan even if we never work together.
        </p>
      </div>
    </section>
  );
}
