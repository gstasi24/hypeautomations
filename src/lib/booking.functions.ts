import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { AvailabilityDay, AvailabilityResponse, BookingConfirmation } from "./booking-shared";

/** Milliseconds offset of a time zone at a given instant. */
function tzOffsetMs(ts: number, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(new Date(ts));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? "0");
  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour") % 24,
    get("minute"),
    get("second"),
  );
  return asUtc - ts;
}

/** Convert a wall-clock date+time in a time zone into a UTC instant. */
function zonedToUtc(date: string, time: string, timeZone: string): Date {
  const naive = Date.parse(`${date}T${time.slice(0, 5)}:00Z`);
  let ts = naive;
  for (let i = 0; i < 3; i += 1) {
    ts = naive - tzOffsetMs(ts, timeZone);
  }
  return new Date(ts);
}

function dateKeyInTz(ts: number, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(ts));
  return parts;
}

function addDays(dateKey: string, days: number): string {
  const d = new Date(`${dateKey}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function weekdayOf(dateKey: string): number {
  return new Date(`${dateKey}T12:00:00Z`).getUTCDay();
}

function fmt(iso: string, timeZone: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-GB", { timeZone, ...options }).format(new Date(iso));
}

async function buildAvailability(): Promise<AvailabilityResponse> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const [settingsRes, rulesRes, blockedRes] = await Promise.all([
    supabaseAdmin.from("booking_settings").select("*").limit(1).maybeSingle(),
    supabaseAdmin.from("availability_rules").select("*").eq("enabled", true),
    supabaseAdmin.from("blocked_dates").select("blocked_on"),
  ]);

  const settings = settingsRes.data ?? {
    timezone: "Europe/Rome",
    slot_duration_minutes: 30,
    buffer_minutes: 15,
    max_bookings_per_day: 6,
    min_notice_hours: 12,
    booking_horizon_days: 30,
    meeting_type: "Online consultation",
  };

  const timeZone = settings.timezone ?? "Europe/Rome";
  const duration = settings.slot_duration_minutes ?? 30;
  const buffer = settings.buffer_minutes ?? 15;
  const step = (duration + buffer) * 60_000;
  const horizon = settings.booking_horizon_days ?? 30;

  const now = Date.now();
  const earliest = now + (settings.min_notice_hours ?? 12) * 3_600_000;
  const todayKey = dateKeyInTz(now, timeZone);
  const lastKey = addDays(todayKey, horizon);

  const rangeStart = zonedToUtc(todayKey, "00:00", timeZone).toISOString();
  const rangeEnd = zonedToUtc(addDays(lastKey, 1), "00:00", timeZone).toISOString();

  const bookingsRes = await supabaseAdmin
    .from("bookings")
    .select("slot_start, slot_end")
    .eq("status", "confirmed")
    .gte("slot_start", rangeStart)
    .lt("slot_start", rangeEnd);

  const taken = (bookingsRes.data ?? []).map((b) => ({
    start: Date.parse(b.slot_start),
    end: Date.parse(b.slot_end),
  }));
  const blocked = new Set((blockedRes.data ?? []).map((b) => b.blocked_on));
  const rules = rulesRes.data ?? [];

  const perDayCount = new Map<string, number>();
  taken.forEach((t) => {
    const key = dateKeyInTz(t.start, timeZone);
    perDayCount.set(key, (perDayCount.get(key) ?? 0) + 1);
  });

  const days: AvailabilityDay[] = [];

  for (let i = 0; i <= horizon; i += 1) {
    const dateKey = addDays(todayKey, i);
    if (blocked.has(dateKey)) continue;
    if ((perDayCount.get(dateKey) ?? 0) >= (settings.max_bookings_per_day ?? 6)) continue;

    const dayRules = rules.filter((r) => r.weekday === weekdayOf(dateKey));
    if (dayRules.length === 0) continue;

    const slots: AvailabilityDay["slots"] = [];

    dayRules
      .slice()
      .sort((a, b) => a.start_time.localeCompare(b.start_time))
      .forEach((rule) => {
        const windowStart = zonedToUtc(dateKey, rule.start_time, timeZone).getTime();
        const windowEnd = zonedToUtc(dateKey, rule.end_time, timeZone).getTime();

        for (let start = windowStart; start + duration * 60_000 <= windowEnd; start += step) {
          const end = start + duration * 60_000;
          if (start < earliest) continue;
          const clash = taken.some(
            (t) => start < t.end + buffer * 60_000 && end + buffer * 60_000 > t.start,
          );
          if (clash) continue;
          const iso = new Date(start).toISOString();
          slots.push({
            start: iso,
            end: new Date(end).toISOString(),
            label: fmt(iso, timeZone, { hour: "2-digit", minute: "2-digit", hour12: false }),
          });
        }
      });

    if (slots.length === 0) continue;

    days.push({
      date: dateKey,
      label: fmt(new Date(`${dateKey}T12:00:00Z`).toISOString(), "UTC", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      slots,
    });

    if (days.length >= 14) break;
  }

  return {
    timezone: timeZone,
    meetingType: settings.meeting_type ?? "Online consultation",
    durationMinutes: duration,
    days,
  };
}

export const getAvailability = createServerFn({ method: "GET" }).handler(async () => {
  try {
    return await buildAvailability();
  } catch (error) {
    console.error("getAvailability failed", error);
    return {
      timezone: "Europe/Rome",
      meetingType: "Online consultation",
      durationMinutes: 30,
      days: [],
    } satisfies AvailabilityResponse;
  }
});

const bookingSchema = z.object({
  slotStart: z.string().min(10),
  businessType: z.string().max(80).optional().default(""),
  automationGoals: z.array(z.string().max(80)).max(20).default([]),
  enquirySources: z.array(z.string().max(80)).max(20).default([]),
  tools: z.array(z.string().max(80)).max(30).default([]),
  toolsOther: z.string().max(500).optional().default(""),
  fullName: z.string().trim().min(2).max(120),
  company: z.string().trim().max(160).optional().default(""),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(5).max(60),
  website: z.string().trim().max(200).optional().default(""),
  notes: z.string().trim().max(1500).optional().default(""),
  consent: z.literal(true),
  visitorTimezone: z.string().max(80).optional().default(""),
});

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => bookingSchema.parse(data))
  .handler(
    async ({
      data,
    }): Promise<{ ok: true; booking: BookingConfirmation } | { ok: false; error: string }> => {
      const availability = await buildAvailability();
      const slot = availability.days
        .flatMap((d) => d.slots)
        .find((s) => s.start === data.slotStart);

      if (!slot) {
        return {
          ok: false,
          error: "That time is no longer available. Please choose another slot.",
        };
      }

      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: inserted, error } = await supabaseAdmin
        .from("bookings")
        .insert({
          slot_start: slot.start,
          slot_end: slot.end,
          full_name: data.fullName,
          company: data.company || null,
          email: data.email,
          phone: data.phone,
          website: data.website || null,
          notes: data.notes || null,
          business_type: data.businessType || null,
          automation_goals: data.automationGoals,
          enquiry_sources: data.enquirySources,
          tools: data.tools,
          tools_other: data.toolsOther || null,
          consent: data.consent,
          timezone: data.visitorTimezone || availability.timezone,
        })
        .select("id, slot_start, slot_end, manage_token")
        .single();

      if (error || !inserted) {
        console.error("createBooking failed", error);
        if (error?.code === "23505" || error?.code === "23P01" || error?.code === "23505") {
          return { ok: false, error: "That time was just taken. Please pick another slot." };
        }
        return { ok: false, error: "We couldn't confirm the booking. Please try another time." };
      }

      return {
        ok: true,
        booking: {
          id: inserted.id,
          slotStart: inserted.slot_start,
          slotEnd: inserted.slot_end,
          timezone: availability.timezone,
          dateLabel: fmt(inserted.slot_start, availability.timezone, {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          timeLabel: fmt(inserted.slot_start, availability.timezone, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          manageToken: inserted.manage_token,
        },
      };
    },
  );
