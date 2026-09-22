import { useMemo, useState } from "react";
import { Instrument } from "@/components/site/Section";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/components/booking/BookingProvider";

export function Calculator() {
  const [tasks, setTasks] = useState(30);
  const [minutes, setMinutes] = useState(6);
  const { openBooking } = useBooking();

  const result = useMemo(() => {
    const weeklyMinutes = tasks * minutes;
    const weeklyHours = weeklyMinutes / 60;
    return {
      weeklyHours: Math.round(weeklyHours * 10) / 10,
      monthlyHours: Math.round(weeklyHours * 4.33),
      yearlyDays: Math.round((weeklyHours * 52) / 8),
    };
  }, [tasks, minutes]);

  return (
    <Instrument
      rail="flow"
      title="How much time is manual work costing you each week?"
      lead="Your own estimate, from the numbers you enter."
    >
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-10">
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="tasks" className="text-sm font-medium">
                Repetitive tasks per week
              </label>
              <span className="text-2xl font-bold tabular-nums">{tasks}</span>
            </div>
            <Slider
              id="tasks"
              className="mt-4"
              min={5}
              max={300}
              step={5}
              value={[tasks]}
              onValueChange={(value) => setTasks(value[0] ?? tasks)}
            />
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="minutes" className="text-sm font-medium">
                Minutes per task
              </label>
              <span className="text-2xl font-bold tabular-nums">{minutes}</span>
            </div>
            <Slider
              id="minutes"
              className="mt-4"
              min={1}
              max={60}
              step={1}
              value={[minutes]}
              onValueChange={(value) => setMinutes(value[0] ?? minutes)}
            />
          </div>
        </div>

        <div className="border-t border-border pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
          <p className="text-sm font-semibold">Estimated time spent</p>
          <p className="mt-4 text-5xl font-extrabold tabular-nums">{result.weeklyHours}h</p>
          <p className="text-sm text-muted-foreground">every week</p>
          <dl className="mt-6 flex gap-8 border-t border-border pt-5">
            <div>
              <dd className="text-xl font-bold tabular-nums">{result.monthlyHours}h</dd>
              <dt className="text-xs text-muted-foreground">per month</dt>
            </div>
            <div>
              <dd className="text-xl font-bold tabular-nums">{result.yearlyDays}</dd>
              <dt className="text-xs text-muted-foreground">working days per year</dt>
            </div>
          </dl>

          <Button size="lg" className="mt-8 w-full sm:w-auto" onClick={openBooking}>
            Book a free consultation
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">Not a promise of results.</p>
        </div>
      </div>
    </Instrument>
  );
}
