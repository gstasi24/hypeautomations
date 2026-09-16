import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: adminRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    const isAdmin = Boolean(adminRow);

    if (!isAdmin) {
      return {
        isAdmin: false as const,
        bookings: [],
        blockedDates: [],
        availability: [],
        settings: null,
      };
    }

    const [bookings, blockedDates, availability, settings] = await Promise.all([
      supabase.from("bookings").select("*").order("slot_start", { ascending: true }),
      supabase.from("blocked_dates").select("*").order("blocked_on", { ascending: true }),
      supabase
        .from("availability_rules")
        .select("*")
        .order("weekday", { ascending: true })
        .order("start_time", { ascending: true }),
      supabase.from("booking_settings").select("*").limit(1).maybeSingle(),
    ]);

    return {
      isAdmin: true as const,
      bookings: bookings.data ?? [],
      blockedDates: blockedDates.data ?? [],
      availability: availability.data ?? [],
      settings: settings.data ?? null,
    };
  });

export const setBookingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({ id: z.string().uuid(), status: z.enum(["confirmed", "cancelled", "completed"]) })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("bookings")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const toggleAvailabilityRule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), enabled: z.boolean() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("availability_rules")
      .update({ enabled: data.enabled })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const addBlockedDate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({ date: z.string().min(10).max(10), reason: z.string().max(200).optional() })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("blocked_dates")
      .insert({ blocked_on: data.date, reason: data.reason ?? null });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const removeBlockedDate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("blocked_dates").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateBookingSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        timezone: z.string().min(2).max(60),
        slot_duration_minutes: z.number().int().min(15).max(180),
        buffer_minutes: z.number().int().min(0).max(120),
        max_bookings_per_day: z.number().int().min(1).max(20),
        min_notice_hours: z.number().int().min(0).max(168),
        booking_horizon_days: z.number().int().min(1).max(120),
        meeting_type: z.string().min(2).max(80),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("booking_settings")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", true);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
