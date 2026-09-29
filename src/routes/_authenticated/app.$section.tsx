import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useMyAccount, primaryOrder } from "@/components/private-ai/useAccount";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/private-ai/analytics";
import { MAINTENANCE_CENTS, TIER_INFO, formatEuro, label, modelLabel, type Tier } from "@/lib/private-ai/plans";

const SECTIONS = ["history", "integrations", "memory", "schedules", "settings", "billing"] as const;
type Section = (typeof SECTIONS)[number];

export const Route = createFileRoute("/_authenticated/app/$section")({
  beforeLoad: ({ params }) => {
    if (!SECTIONS.includes(params.section as Section)) throw notFound();
  },
  component: SectionPage,
  notFoundComponent: () => <p className="text-muted-foreground">This page doesn't exist.</p>,
});

const EMPTY: Record<string, { title: string; text: string }> = {
  history: { title: "History", text: "Conversations and completed actions will appear here once your assistant is active." },
  integrations: { title: "Integrations", text: "The tools included in your plan are connected during onboarding. Nothing is connected yet." },
  memory: { title: "Memory", text: "Context your assistant keeps about your business will be listed and editable here once it's active." },
  schedules: { title: "Schedules", text: "Recurring requests, like a Monday briefing, will be managed here once your assistant is active." },
};

function SectionPage() {
  const { section } = Route.useParams();
  if (section === "settings") return <SettingsPage />;
  if (section === "billing") return <BillingPage />;
  const e = EMPTY[section]!;
  return (
    <div className="max-w-3xl">
      <h1 className="type-title">{e.title}</h1>
      <div className="mt-6 rounded-panel border border-dashed border-border p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-link">Setup pending</p>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">{e.text}</p>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 px-5 py-3.5 text-sm sm:flex-row sm:justify-between sm:gap-6">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="sm:text-right">{v}</dd>
    </div>
  );
}
const d = (s: string | null | undefined) => (s ? new Date(s).toLocaleDateString() : "—");

function SettingsPage() {
  const { data } = useMyAccount();
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);
  const c = data?.customer;
  const o = data ? primaryOrder(data.orders) : null;
  return (
    <div className="max-w-3xl">
      <h1 className="type-title">Settings</h1>
      <dl className="mt-6 divide-y divide-border rounded-panel border border-border bg-surface">
        <Row k="Name" v={[c?.first_name, c?.last_name].filter(Boolean).join(" ") || "—"} />
        <Row k="Email" v={email ?? c?.email ?? "—"} />
        <Row k="Company" v={c?.company_name ?? "—"} />
        <Row k="Phone" v={c?.phone ?? "—"} />
        <Row k="Plan" v={o ? TIER_INFO[o.tier as Tier].label : "No plan yet"} />
        <Row k="Payment model" v={o ? modelLabel(o.payment_model as "monthly") : "—"} />
        <Row k="Account status" v={label(c?.account_status ?? "account_created")} />
        <Row k="Purchase date" v={d(o?.purchased_at)} />
        <Row k="Billing status" v={label(o?.payment_status)} />
        <Row k={o?.payment_model === "one_time" ? "Maintenance renewal" : "Next payment"} v={d(o?.payment_model === "one_time" ? o?.maintenance_renewal_at : o?.next_billing_at)} />
      </dl>
      <p className="mt-4 text-sm text-muted-foreground">
        Need to change your details? Update them in{" "}
        <Link to="/private-ai/checkout" search={{ step: "details" }} className="text-link">customer details</Link>.
      </p>
    </div>
  );
}

function BillingPage() {
  const { data } = useMyAccount();
  useEffect(() => track("billing_viewed"), []);
  const o = data ? primaryOrder(data.orders) : null;
  const oneTime = o?.payment_model === "one_time";
  return (
    <div className="max-w-3xl">
      <h1 className="type-title">Billing</h1>
      {!o ? (
        <div className="mt-6 rounded-panel border border-border bg-surface p-6 text-sm">
          <p>No plan yet.</p>
          <Button size="sm" className="mt-4" asChild><Link to="/private-ai" hash="pricing">Choose Your AI</Link></Button>
        </div>
      ) : (
        <>
          <dl className="mt-6 divide-y divide-border rounded-panel border border-border bg-surface">
            <Row k="Plan" v={`Hype Private AI · ${TIER_INFO[o.tier as Tier].label}`} />
            <Row k="Payment model" v={modelLabel(o.payment_model as "monthly")} />
            <Row k="Price" v={`${formatEuro(o.amount_cents)}${oneTime ? "" : "/month"}`} />
            <Row k="Payment status" v={label(o.payment_status)} />
            <Row k="Next charge" v={oneTime ? "—" : d(o.next_billing_at)} />
            {oneTime && (
              <Row
                k="Annual maintenance"
                v={o.maintenance_renewal_at ? `${formatEuro(MAINTENANCE_CENTS)} · renews ${d(o.maintenance_renewal_at)}` : `${formatEuro(MAINTENANCE_CENTS)}/year · not yet scheduled`}
              />
            )}
          </dl>
          <h2 className="mt-8 font-semibold">Payment history</h2>
          {data!.payments.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No payments yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border rounded-panel border border-border bg-surface text-sm">
              {data!.payments.map((p) => (
                <li key={p.id} className="flex justify-between px-5 py-3">
                  <span>{d(p.occurred_at)} · {p.kind}</span>
                  <span>{formatEuro(p.amount_cents)} · {label(p.status)}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-6 text-sm text-muted-foreground">
            {o.payment_status === "unpaid"
              ? "Secure payment integration will be enabled before launch. No payment has been taken."
              : "Invoices and payment methods will be managed through the secure billing portal."}
          </p>
        </>
      )}
    </div>
  );
}
