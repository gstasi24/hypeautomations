import { Reveal } from "@/components/site/Reveal";
import { ArrowDown, Check } from "lucide-react";

const BEFORE = [
  "Lead",
  "Inbox",
  "Copy data",
  "Spreadsheet",
  "WhatsApp",
  "Reminder",
  "Follow-up",
  "Calendar",
];

const AFTER = ["Lead", "AI", "CRM", "WhatsApp", "Follow-up", "Booking"];

export function BeforeAfter() {
  return (
    <section className="relative py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
        <Reveal>
          <h2 className="max-w-xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            From manual process to <span className="text-gradient">automated system.</span>
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-5 sm:mt-10 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl border border-border bg-surface/40 p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
                Before
              </p>
              <ul className="mt-6 space-y-2">
                {BEFORE.map((item, index) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-surface-2/30 px-4 py-3 text-sm text-muted-foreground"
                    style={{ marginLeft: `${(index % 3) * 12}px` }}
                  >
                    <span className="size-1.5 rounded-full bg-muted-foreground/60" />
                    {item}
                    {index < BEFORE.length - 1 ? (
                      <ArrowDown className="ml-auto size-3.5 opacity-40" />
                    ) : null}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-muted-foreground">
                Eight manual handovers. Every one of them can break.
              </p>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="relative h-full overflow-hidden rounded-3xl border border-primary/40 bg-surface/70 p-6 sm:p-8">
              <div className="brand-glow -right-10 top-1/3 h-56 w-56 opacity-60" />
              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-secondary">
                  After
                </p>
                <ul className="mt-6 space-y-2">
                  {AFTER.map((item, index) => (
                    <li key={item}>
                      <div className="flex items-center gap-3 rounded-xl border border-border-strong bg-surface-2/70 px-4 py-3.5">
                        <span className="flex size-7 items-center justify-center rounded-lg bg-brand-gradient text-xs font-bold text-primary-foreground">
                          {index + 1}
                        </span>
                        <span className="text-sm font-semibold uppercase tracking-wide">
                          {item}
                        </span>
                        {index === AFTER.length - 1 ? (
                          <Check className="ml-auto size-4 text-success" />
                        ) : null}
                      </div>
                      {index < AFTER.length - 1 ? (
                        <div className="ml-[1.6rem] h-3 w-px overflow-hidden bg-border-strong">
                          <span className="block h-full w-px bg-accent animate-pulse-down" />
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm text-muted-foreground">
                  One connected system. No handovers to forget.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <p className="mx-auto mt-8 max-w-2xl text-center text-lg text-muted-foreground sm:mt-10 sm:text-xl">
            Automation doesn't replace your business. It removes the{" "}
            <span className="text-foreground">friction slowing it down.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
