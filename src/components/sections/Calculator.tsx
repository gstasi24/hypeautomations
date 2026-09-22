import { useMemo, useState } from "react";
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
    <section className="relative py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-5xl px-5 lg:px-8">
        <div>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            How much time is manual work costing you each week?
          </h2>
        </div>

        <div>
          <div className="mt-8 grid gap-6 rounded-3xl border border-border bg-surface/60 p-6 sm:mt-10 sm:p-9 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-9">
              <div>
                <div className="flex items-baseline justify-between">
                  <label htmlFor="tasks" className="text-sm font-medium">
                    Repetitive tasks per week
                  </label>
                  <span className="text-2xl font-bold">{tasks}</span>
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
                  <span className="text-2xl font-bold">{minutes}</span>
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

            <div className="rounded-2xl border border-primary/40 bg-surface-2/60 p-6">
              <p className="text-xs font-bold text-secondary">Estimated time spent</p>
              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-4xl font-extrabold">{result.weeklyHours}h</p>
                  <p className="text-sm text-muted-foreground">every week</p>
                </div>
                <div className="flex gap-6 border-t border-border pt-4">
                  <div>
                    <p className="text-xl font-bold">{result.monthlyHours}h</p>
                    <p className="text-xs text-muted-foreground">per month</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{result.yearlyDays}</p>
                    <p className="text-xs text-muted-foreground">working days per year</p>
                  </div>
                </div>
              </div>

              <Button className="mt-7 w-full" onClick={openBooking}>
                Book a free consultation
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                Your own estimate based on the numbers you enter. Not a promise of results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
