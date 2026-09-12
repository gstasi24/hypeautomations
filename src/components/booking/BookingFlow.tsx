import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { createBooking, getAvailability } from "@/lib/booking.functions";
import {
  AUTOMATION_GOALS,
  BUSINESS_TYPES,
  ENQUIRY_SOURCES,
  TOOL_OPTIONS,
  type BookingConfirmation,
} from "@/lib/booking-shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  CalendarPlus,
  Check,
  Clock,
  Loader2,
} from "lucide-react";

const STEP_LABELS = ["Business", "Goals", "Enquiries", "Tools", "Time", "Details"];

type FormState = {
  businessType: string;
  automationGoals: string[];
  enquirySources: string[];
  tools: string[];
  toolsOther: string;
  slotStart: string;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  notes: string;
  consent: boolean;
};

const initialState: FormState = {
  businessType: "",
  automationGoals: [],
  enquirySources: [],
  tools: [],
  toolsOther: "",
  slotStart: "",
  fullName: "",
  company: "",
  email: "",
  phone: "",
  website: "",
  notes: "",
  consent: false,
};

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "rounded-xl border px-4 py-3 text-left text-sm transition-all",
        selected
          ? "border-primary bg-primary/15 text-foreground shadow-[0_0_0_1px_var(--color-primary)]"
          : "border-border bg-surface-2/60 text-muted-foreground hover:border-border-strong hover:text-foreground",
      )}
    >
      <span className="flex items-center justify-between gap-2">
        {label}
        {selected ? <Check className="size-4 text-accent" /> : null}
      </span>
    </button>
  );
}

function icsHref(booking: BookingConfirmation) {
  const stamp = (iso: string) => iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hype Automations//Consultation//EN",
    "BEGIN:VEVENT",
    `UID:${booking.id}`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(booking.slotStart)}`,
    `DTEND:${stamp(booking.slotEnd)}`,
    "SUMMARY:Automation consultation with Hype Automations",
    "DESCRIPTION:We'll map your current workflow and identify where automation could help most.",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
}

export function BookingFlow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeDate, setActiveDate] = useState<string | null>(null);

  const fetchAvailability = useServerFn(getAvailability);
  const availabilityQuery = useQuery({
    queryKey: ["availability"],
    queryFn: () => fetchAvailability(),
    staleTime: 60_000,
  });

  const submit = useMutation({
    mutationFn: useServerFn(createBooking),
    onSuccess: (result) => {
      if (result.ok) {
        setConfirmation(result.booking);
        setError(null);
      } else {
        setError(result.error);
        availabilityQuery.refetch();
        setStep(4);
      }
    },
    onError: () => setError("Something went wrong. Please try again."),
  });

  const availability = availabilityQuery.data;
  const days = availability?.days ?? [];
  const selectedDate = activeDate ?? days[0]?.date ?? null;
  const selectedDay = days.find((d) => d.date === selectedDate);

  const canContinue = useMemo(() => {
    switch (step) {
      case 0:
        return form.businessType !== "";
      case 1:
        return form.automationGoals.length > 0;
      case 2:
        return form.enquirySources.length > 0;
      case 3:
        return form.tools.length > 0 || form.toolsOther.trim().length > 1;
      case 4:
        return form.slotStart !== "";
      default:
        return true;
    }
  }, [step, form]);

  if (confirmation) {
    return (
      <section className="relative overflow-hidden p-6 sm:p-9">
        <div className="brand-glow -top-24 left-1/2 h-72 w-72 -translate-x-1/2 opacity-70" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-success/40 bg-success/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-success">
            <Check className="size-3.5" /> Confirmed
          </span>
          <h2 className="mt-5 text-3xl font-bold sm:text-4xl">You're booked.</h2>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Your consultation with Hype Automations has been scheduled. We'll use the call to
            understand your current workflow and identify the processes with the strongest automation
            potential.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Date", value: confirmation.dateLabel },
              { label: "Time", value: confirmation.timeLabel },
              { label: "Timezone", value: confirmation.timezone },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-border bg-surface-2/60 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-1 font-semibold">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild>
              <a href={icsHref(confirmation)} download="hype-automations-consultation.ics">
                <CalendarPlus className="size-4" /> Add to calendar
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href={`mailto:hello@hypeautomations.com?subject=Reschedule%20consultation%20${confirmation.id}`}
              >
                Reschedule
              </a>
            </Button>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-surface-2/40 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              What happens next
            </h3>
            <ol className="mt-4 space-y-3 text-sm">
              {[
                "We review the information you provided.",
                "We meet and map your workflow.",
                "We identify relevant automation opportunities.",
                "If there's a good fit, we prepare a personalised proposal and quote.",
              ].map((item, index) => (
                <li key={item} className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ol>
          </div>

          <Button variant="ghost" className="mt-6" onClick={onClose}>
            Back to site
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden p-6 sm:p-9">
      <div className="brand-glow -top-32 right-0 h-64 w-64 opacity-50" />
      <div className="relative">
        <header>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Free consultation
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            {step === 0 ? "Let's understand your business." : null}
            {step === 1 ? "What would you most like to automate?" : null}
            {step === 2 ? "Where do most enquiries come from?" : null}
            {step === 3 ? "Which tools do you currently use?" : null}
            {step === 4 ? "Choose a time that works for you." : null}
            {step === 5 ? "Where should we send the details?" : null}
          </h2>
        </header>

        <div className="mt-5 flex gap-1.5" aria-hidden="true">
          {STEP_LABELS.map((label, index) => (
            <span
              key={label}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors duration-500",
                index <= step ? "bg-brand-gradient" : "bg-muted",
              )}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Step {step + 1} of {STEP_LABELS.length} · {STEP_LABELS[step]}
        </p>

        <div className="mt-6">
          {step === 0 ? (
            <div className="grid gap-2.5 sm:grid-cols-2">
              {BUSINESS_TYPES.map((option) => (
                <OptionButton
                  key={option}
                  label={option}
                  selected={form.businessType === option}
                  onClick={() => setForm((f) => ({ ...f, businessType: option }))}
                />
              ))}
            </div>
          ) : null}

          {step === 1 ? (
            <>
              <p className="mb-3 text-sm text-muted-foreground">Select everything that applies.</p>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {AUTOMATION_GOALS.map((option) => (
                  <OptionButton
                    key={option}
                    label={option}
                    selected={form.automationGoals.includes(option)}
                    onClick={() =>
                      setForm((f) => ({ ...f, automationGoals: toggle(f.automationGoals, option) }))
                    }
                  />
                ))}
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-2.5 sm:grid-cols-2">
              {ENQUIRY_SOURCES.map((option) => (
                <OptionButton
                  key={option}
                  label={option}
                  selected={form.enquirySources.includes(option)}
                  onClick={() =>
                    setForm((f) => ({ ...f, enquirySources: toggle(f.enquirySources, option) }))
                  }
                />
              ))}
            </div>
          ) : null}

          {step === 3 ? (
            <>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {TOOL_OPTIONS.map((option) => (
                  <OptionButton
                    key={option}
                    label={option}
                    selected={form.tools.includes(option)}
                    onClick={() => setForm((f) => ({ ...f, tools: toggle(f.tools, option) }))}
                  />
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="tools-other">Anything else you use?</Label>
                <Input
                  id="tools-other"
                  value={form.toolsOther}
                  onChange={(e) => setForm((f) => ({ ...f, toolsOther: e.target.value }))}
                  placeholder="e.g. a custom CRM, Zoho, Pipedrive"
                />
              </div>
            </>
          ) : null}

          {step === 4 ? (
            <div>
              {availabilityQuery.isLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" /> Loading available times…
                </div>
              ) : days.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No times are open right now. Leave your details on the next step and we'll come
                  back with options.
                </p>
              ) : (
                <>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {days.map((day) => (
                      <button
                        key={day.date}
                        type="button"
                        onClick={() => {
                          setActiveDate(day.date);
                          setForm((f) => ({ ...f, slotStart: "" }));
                        }}
                        className={cn(
                          "shrink-0 rounded-xl border px-4 py-2.5 text-sm transition-colors",
                          selectedDate === day.date
                            ? "border-primary bg-primary/15"
                            : "border-border bg-surface-2/60 text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {selectedDay?.slots.map((slot) => (
                      <button
                        key={slot.start}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, slotStart: slot.start }))}
                        className={cn(
                          "rounded-xl border py-3 text-sm transition-all",
                          form.slotStart === slot.start
                            ? "border-accent bg-accent/15 text-foreground"
                            : "border-border bg-surface-2/60 text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>

                  <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="size-3.5" />
                    {availability?.durationMinutes} minutes · {availability?.meetingType} · times
                    shown in {availability?.timezone}
                  </p>
                </>
              )}
              {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
            </div>
          ) : null}

          {step === 5 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full-name">Name *</Label>
                <Input
                  id="full-name"
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Business email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone / WhatsApp *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="website">Website (optional)</Label>
                <Input
                  id="website"
                  value={form.website}
                  onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                  placeholder="yourcompany.com"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="notes">Anything we should know before the call?</Label>
                <Textarea
                  id="notes"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </div>
              <label className="flex items-start gap-3 text-sm text-muted-foreground sm:col-span-2">
                <Checkbox
                  checked={form.consent}
                  onCheckedChange={(checked) =>
                    setForm((f) => ({ ...f, consent: checked === true }))
                  }
                />
                <span>
                  I agree that Hype Automations may contact me about this consultation and store the
                  details I provided for that purpose.
                </span>
              </label>
              {error ? (
                <p className="text-sm text-destructive sm:col-span-2">{error}</p>
              ) : null}
            </div>
          ) : null}
        </div>

        <footer className="mt-8 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={() => (step === 0 ? onClose() : setStep((s) => s - 1))}
            disabled={submit.isPending}
          >
            <ArrowLeft className="size-4" /> {step === 0 ? "Cancel" : "Back"}
          </Button>

          {step < 5 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canContinue}>
              Continue <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              disabled={
                submit.isPending ||
                !form.consent ||
                form.fullName.trim().length < 2 ||
                !form.email.includes("@") ||
                form.phone.trim().length < 5 ||
                !form.slotStart
              }
              onClick={() =>
                submit.mutate({
                  data: {
                    ...form,
                    consent: true as const,
                    visitorTimezone:
                      Intl.DateTimeFormat().resolvedOptions().timeZone ?? "",
                  },
                })
              }
            >
              {submit.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CalendarCheck className="size-4" />
              )}
              Confirm my consultation
            </Button>
          )}
        </footer>

        <p className="mt-4 text-xs text-muted-foreground">
          No commitment. No generic sales pitch.
        </p>
      </div>
    </section>
  );
}
