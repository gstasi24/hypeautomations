import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { ACCOUNT_STATUSES, SETUP_STATUSES, USE_CASES } from "./plans";

const utmSchema = z
  .object({
    utm_source: z.string().max(200).optional(),
    utm_medium: z.string().max(200).optional(),
    utm_campaign: z.string().max(200).optional(),
    utm_content: z.string().max(200).optional(),
    utm_term: z.string().max(200).optional(),
  })
  .default({});

/** Drop undefined keys so partial payloads satisfy exact optional types. */
function defined<T extends Record<string, unknown>>(o: T) {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as {
    [K in keyof T]?: Exclude<T[K], undefined>;
  };
}

export const getMyAccount = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [customer, orders, payments] = await Promise.all([
      supabase.from("pai_customers").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("pai_orders").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("pai_payments").select("*").eq("user_id", userId).order("occurred_at", { ascending: false }),
    ]);
    return {
      customer: customer.data ?? null,
      orders: orders.data ?? [],
      payments: payments.data ?? [],
    };
  });

export const saveCustomerDetails = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        first_name: z.string().trim().max(80).optional(),
        last_name: z.string().trim().max(80).optional(),
        company_name: z.string().trim().min(1).max(160),
        phone: z.string().trim().min(5).max(40),
        country: z.string().trim().min(2).max(80),
        website: z.string().trim().max(200).optional(),
        use_case: z.enum(USE_CASES),
        acknowledged: z.literal(true),
        utm: utmSchema,
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId, claims } = context;
    const { utm, ...rest } = data;
    const email = (claims as { email?: string }).email ?? null;
    const { data: existing } = await supabase
      .from("pai_customers")
      .select("id, utm_source")
      .eq("user_id", userId)
      .maybeSingle();
    const payload = defined({
      ...rest,
      website: rest.website || null,
      email,
      ...(existing?.utm_source ? {} : utm),
    });
    const res = existing
      ? await supabase.from("pai_customers").update(payload).eq("user_id", userId)
      : await supabase.from("pai_customers").insert({ ...payload, user_id: userId });
    if (res.error) throw new Error(res.error.message);
    return { ok: true };
  });

/** Creates (or refreshes) the open order. Prices are computed by the database, never trusted from the client. */
export const upsertOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        tier: z.enum(["essential", "advanced", "pro"]),
        payment_model: z.enum(["one_time", "monthly"]),
        utm: utmSchema,
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: open } = await supabase
      .from("pai_orders")
      .select("id")
      .eq("user_id", userId)
      .eq("payment_status", "unpaid")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const res = open
      ? await supabase
          .from("pai_orders")
          .update({ tier: data.tier, payment_model: data.payment_model, status: "order_review" })
          .eq("id", open.id)
          .select("*")
          .single()
      : await supabase
          .from("pai_orders")
          .insert({ user_id: userId, tier: data.tier, payment_model: data.payment_model, ...defined(data.utm) })
          .select("*")
          .single();
    if (res.error) throw new Error(res.error.message);
    return res.data;
  });

export const startCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ orderId: z.string().uuid(), origin: z.string().url() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId, claims } = context;
    const { data: order, error } = await supabase
      .from("pai_orders")
      .select("*")
      .eq("id", data.orderId)
      .eq("user_id", userId)
      .single();
    if (error || !order) throw new Error("Order not found");
    const { data: customer } = await supabase
      .from("pai_customers")
      .select("id, acknowledged")
      .eq("user_id", userId)
      .maybeSingle();
    if (!customer?.acknowledged) throw new Error("Please complete your customer details first.");

    await supabase.from("pai_orders").update({ status: "checkout_started" }).eq("id", order.id);

    const { getPaymentProvider } = await import("./payment-provider.server");
    return getPaymentProvider().startCheckout({
      orderId: order.id,
      userId,
      email: (claims as { email?: string }).email ?? null,
      tier: order.tier as "essential" | "advanced" | "pro",
      model: order.payment_model as "one_time" | "monthly",
      amountCents: order.amount_cents,
      maintenanceCents: order.maintenance_cents,
      currency: order.currency,
      successUrl: `${data.origin}/app?purchase=success`,
      cancelUrl: `${data.origin}/private-ai/checkout?step=review`,
    });
  });

/* ---------------- Admin ---------------- */

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Forbidden");
}

export const adminListCustomers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: role } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!role) return { isAdmin: false as const, customers: [], orders: [], payments: [], notes: [] };
    const [customers, orders, payments, notes] = await Promise.all([
      supabase.from("pai_customers").select("*").order("created_at", { ascending: false }),
      supabase.from("pai_orders").select("*").order("created_at", { ascending: false }),
      supabase.from("pai_payments").select("*").order("occurred_at", { ascending: false }),
      supabase.from("pai_admin_notes").select("*").order("created_at", { ascending: false }),
    ]);
    return {
      isAdmin: true as const,
      customers: customers.data ?? [],
      orders: orders.data ?? [],
      payments: payments.data ?? [],
      notes: notes.data ?? [],
    };
  });

export const adminUpdateCustomer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        user_id: z.string().uuid(),
        first_name: z.string().max(80).nullable().optional(),
        last_name: z.string().max(80).nullable().optional(),
        company_name: z.string().max(160).nullable().optional(),
        phone: z.string().max(40).nullable().optional(),
        country: z.string().max(80).nullable().optional(),
        website: z.string().max(200).nullable().optional(),
        account_status: z.enum(ACCOUNT_STATUSES).optional(),
        setup_status: z.enum(SETUP_STATUSES).optional(),
        assigned_staff: z.string().max(120).nullable().optional(),
        onboarding_notes: z.string().max(4000).nullable().optional(),
        target_go_live: z.string().max(10).nullable().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { user_id, ...rest } = data;
    const patch = defined({ ...rest, target_go_live: rest.target_go_live || null });
    const { error } = await context.supabase.from("pai_customers").update(patch).eq("user_id", user_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminAddNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ user_id: z.string().uuid(), content: z.string().trim().min(1).max(4000) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("pai_admin_notes").insert({
      customer_user_id: data.user_id,
      author_id: context.userId,
      author_email: (context.claims as { email?: string }).email ?? null,
      content: data.content,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
