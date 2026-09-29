import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Download, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  adminAddNote,
  adminListCustomers,
  adminUpdateCustomer,
} from "@/lib/private-ai/private-ai.functions";
import {
  ACCOUNT_STATUSES,
  MAINTENANCE_CENTS,
  SETUP_STATUSES,
  TIER_INFO,
  formatEuro,
  label,
  modelLabel,
  type Tier,
} from "@/lib/private-ai/plans";

export const Route = createFileRoute("/_authenticated/admin_/private-ai")({
  head: () => ({
    meta: [
      { title: "Private AI Customers | Hype Automations" },
      { name: "description", content: "Internal customer management for Hype Private AI." },
      { property: "og:title", content: "Private AI Customers | Hype Automations" },
      { property: "og:description", content: "Internal customer management for Hype Private AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Crm,
});

type Data = Awaited<ReturnType<typeof adminListCustomers>>;
type Customer = Data["customers"][number];
type Order = Data["orders"][number];

const fmtDate = (s: string | null | undefined) => (s ? new Date(s).toLocaleDateString() : "—");

function Crm() {
  const fetchAll = useServerFn(adminListCustomers);
  const { data, isLoading } = useQuery({ queryKey: ["pai-admin"], queryFn: () => fetchAll() });
  const [q, setQ] = useState("");
  const [model, setModel] = useState("all");
  const [status, setStatus] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = useMemo(() => {
    if (!data?.isAdmin) return [];
    return data.customers.map((c) => {
      const orders = data.orders.filter((o) => o.user_id === c.user_id);
      const order = orders.find((o) => o.payment_status === "paid") ?? orders[0] ?? null;
      const notes = data.notes.filter((n) => n.customer_user_id === c.user_id);
      return { c, order, orders, notes, payments: data.payments.filter((p) => p.user_id === c.user_id) };
    });
  }, [data]);

  const filtered = rows.filter(({ c, order }) => {
    const hay = [c.first_name, c.last_name, c.company_name, c.email, c.phone].join(" ").toLowerCase();
    return (
      (!q || hay.includes(q.toLowerCase())) &&
      (model === "all" || order?.payment_model === model) &&
      (status === "all" || c.account_status === status)
    );
  });

  if (isLoading) return <main className="p-10 text-sm text-muted-foreground">Loading…</main>;
  if (!data?.isAdmin)
    return (
      <main className="flex min-h-screen items-center justify-center p-10 text-center">
        <div>
          <h1 className="text-xl font-semibold">No access</h1>
          <p className="mt-2 text-sm text-muted-foreground">This area is for Hype Automations staff.</p>
          <Button className="mt-5" asChild><Link to="/app">Go to your workspace</Link></Button>
        </div>
      </main>
    );

  const paidPayments = data.payments.filter((p) => p.status === "succeeded" || p.status === "paid");
  const revenue = paidPayments.reduce((s, p) => s + p.amount_cents, 0);
  const kpis = [
    { l: "Total customers", v: rows.length },
    { l: "Active", v: rows.filter((r) => ["account_active", "ready"].includes(r.c.account_status)).length },
    { l: "Pending setup", v: rows.filter((r) => ["setup_pending", "setup_in_progress"].includes(r.c.account_status)).length },
    { l: "Inactive", v: rows.filter((r) => ["inactive", "paused"].includes(r.c.account_status)).length },
    { l: "One-time", v: rows.filter((r) => r.order?.payment_model === "one_time" && r.order.payment_status === "paid").length },
    { l: "Monthly", v: rows.filter((r) => r.order?.payment_model === "monthly" && r.order.payment_status === "paid").length },
    { l: "Revenue collected", v: formatEuro(revenue) },
    { l: "Payments needing attention", v: data.orders.filter((o) => o.payment_status === "failed").length },
  ];

  function exportCsv() {
    const head = ["Name", "Company", "Email", "Phone", "Plan", "Model", "Account", "Setup", "Payment", "Purchased", "Next billing", "Notes"];
    const lines = filtered.map(({ c, order, notes }) =>
      [
        `${c.first_name ?? ""} ${c.last_name ?? ""}`.trim(), c.company_name, c.email, c.phone,
        order ? TIER_INFO[order.tier as Tier].label : "", order ? modelLabel(order.payment_model as "monthly") : "",
        label(c.account_status), label(c.setup_status), label(order?.payment_status),
        order?.purchased_at ?? "", order?.next_billing_at ?? "", notes.length,
      ].map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","),
    );
    const blob = new Blob([[head.join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "private-ai-customers.csv";
    a.click();
  }

  const open = rows.find((r) => r.c.user_id === openId) ?? null;

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-10">
      <Link to="/admin" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Consultations
      </Link>
      <h1 className="mt-3 text-2xl font-bold">Private AI customers</h1>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.l} className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-xs text-muted-foreground">{k.l}</p>
            <p className="mt-1 text-2xl font-bold">{k.v}</p>
          </div>
        ))}
      </div>
      {paidPayments.length === 0 && (
        <p className="mt-3 text-xs text-muted-foreground">Revenue shows confirmed payments only. Payments start once secure checkout is enabled.</p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Input placeholder="Search name, company, email, phone" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        <Select value={model} onValueChange={setModel}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All models</SelectItem>
            <SelectItem value="one_time">One-time</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All account statuses</SelectItem>
            {ACCOUNT_STATUSES.map((s) => <SelectItem key={s} value={s}>{label(s)}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={exportCsv} className="ml-auto"><Download className="size-4" /> Export CSV</Button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-panel border border-border">
        <table className="w-full min-w-[1200px] text-sm">
          <thead className="bg-surface text-left text-xs text-muted-foreground">
            <tr>
              {["Name", "Company", "Email", "Phone", "Plan", "Model", "Account", "Setup", "Payment", "Purchased", "Next billing", "Stripe", "Notes", ""].map((h) => (
                <th key={h} className="p-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr><td colSpan={14} className="p-8 text-center text-muted-foreground">No customers yet.</td></tr>
            )}
            {filtered.map(({ c, order, notes }) => (
              <tr key={c.id} className="hover:bg-surface/60">
                <td className="p-3">{`${c.first_name ?? ""} ${c.last_name ?? ""}`.trim() || "—"}</td>
                <td className="p-3">{c.company_name ?? "—"}</td>
                <td className="p-3">{c.email ?? "—"}</td>
                <td className="p-3">{c.phone ?? "—"}</td>
                <td className="p-3">{order ? TIER_INFO[order.tier as Tier].label : "—"}</td>
                <td className="p-3">{order ? modelLabel(order.payment_model as "monthly") : "—"}</td>
                <td className="p-3"><Badge variant="outline">{label(c.account_status)}</Badge></td>
                <td className="p-3">{label(c.setup_status)}</td>
                <td className="p-3">{label(order?.payment_status)}</td>
                <td className="p-3">{fmtDate(order?.purchased_at)}</td>
                <td className="p-3">{fmtDate(order?.next_billing_at)}</td>
                <td className="p-3">{order?.provider_customer_id ? "Linked" : "Not linked"}</td>
                <td className="p-3">{notes.length ? <span className="inline-flex items-center gap-1"><MessageSquareText className="size-3.5" />{notes.length}</span> : "—"}</td>
                <td className="p-3"><Button size="sm" variant="ghost" onClick={() => setOpenId(c.user_id)}>Open</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sheet open={Boolean(open)} onOpenChange={(v) => !v && setOpenId(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto border-border bg-surface sm:max-w-xl">
          {open && <Detail key={open.c.id} {...open} />}
        </SheetContent>
      </Sheet>
    </main>
  );
}

function Detail({ c, order, orders, notes, payments }: { c: Customer; order: Order | null; orders: Order[]; notes: Data["notes"]; payments: Data["payments"] }) {
  const qc = useQueryClient();
  const update = useServerFn(adminUpdateCustomer);
  const addNote = useServerFn(adminAddNote);
  const [f, setF] = useState({
    first_name: c.first_name ?? "", last_name: c.last_name ?? "", company_name: c.company_name ?? "",
    phone: c.phone ?? "", country: c.country ?? "", website: c.website ?? "",
    account_status: c.account_status, setup_status: c.setup_status,
    assigned_staff: c.assigned_staff ?? "", onboarding_notes: c.onboarding_notes ?? "", target_go_live: c.target_go_live ?? "",
  });
  const [note, setNote] = useState("");
  const refresh = () => qc.invalidateQueries({ queryKey: ["pai-admin"] });

  async function save() {
    try {
      await update({ data: { user_id: c.user_id, ...f, account_status: f.account_status as "ready", setup_status: f.setup_status as "ready" } });
      toast.success("Customer updated");
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  }
  async function submitNote() {
    if (!note.trim()) return;
    try {
      await addNote({ data: { user_id: c.user_id, content: note } });
      setNote("");
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't add note");
    }
  }
  const input = (k: keyof typeof f, lbl: string, type = "text") => (
    <div className="space-y-1.5">
      <Label htmlFor={k}>{lbl}</Label>
      <Input id={k} type={type} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
    </div>
  );
  const oneTime = order?.payment_model === "one_time";

  return (
    <>
      <SheetHeader>
        <SheetTitle>{c.company_name ?? "Customer"}</SheetTitle>
        <p className="text-sm text-muted-foreground">{c.email}</p>
      </SheetHeader>
      <Tabs defaultValue="profile" className="mt-4 px-4 pb-8">
        <TabsList className="flex w-full flex-wrap">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="product">Product</TabsTrigger>
          <TabsTrigger value="implementation">Implementation</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">{input("first_name", "First name")}{input("last_name", "Last name")}</div>
          {input("company_name", "Company")}
          <div className="grid grid-cols-2 gap-3">{input("phone", "Phone")}{input("country", "Country")}</div>
          {input("website", "Website")}
          <p className="text-sm text-muted-foreground">Use case: {c.use_case ?? "—"} · Source: {c.utm_source ?? "direct"}{c.utm_campaign ? ` / ${c.utm_campaign}` : ""}</p>
          <div className="space-y-1.5">
            <Label>Account status</Label>
            <Select value={f.account_status} onValueChange={(v) => setF({ ...f, account_status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{ACCOUNT_STATUSES.map((s) => <SelectItem key={s} value={s}>{label(s)}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Button onClick={save}>Save changes</Button>
        </TabsContent>

        <TabsContent value="product" className="mt-4 space-y-2 text-sm">
          {orders.length === 0 && <p className="text-muted-foreground">No orders yet.</p>}
          {orders.map((o) => (
            <div key={o.id} className="rounded-control border border-border p-3">
              <p className="font-semibold">{TIER_INFO[o.tier as Tier].label} · {modelLabel(o.payment_model as "monthly")}</p>
              <p className="text-muted-foreground">
                {formatEuro(o.amount_cents)}{o.payment_model === "monthly" ? "/month" : ` + ${formatEuro(MAINTENANCE_CENTS)}/year maintenance`} · {label(o.status)} · created {fmtDate(o.created_at)}
              </p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="implementation" className="mt-4 space-y-3">
          <div className="space-y-1.5">
            <Label>Setup status</Label>
            <Select value={f.setup_status} onValueChange={(v) => setF({ ...f, setup_status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{SETUP_STATUSES.map((s) => <SelectItem key={s} value={s}>{label(s)}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {input("assigned_staff", "Assigned staff")}
          {input("target_go_live", "Target go-live", "date")}
          <div className="space-y-1.5">
            <Label htmlFor="on">Onboarding notes</Label>
            <Textarea id="on" rows={5} value={f.onboarding_notes} onChange={(e) => setF({ ...f, onboarding_notes: e.target.value })} />
          </div>
          <Button onClick={save}>Save implementation</Button>
        </TabsContent>

        <TabsContent value="payments" className="mt-4 space-y-2 text-sm">
          <dl className="divide-y divide-border rounded-control border border-border">
            {[
              ["Stripe customer ID", order?.provider_customer_id ?? "Not linked"],
              ["Payment status", label(order?.payment_status)],
              ["Subscription", order?.provider_subscription_id ?? (order?.payment_model === "monthly" ? "Not started" : "—")],
              ["Initial purchase", fmtDate(order?.purchased_at)],
              ["Next payment", fmtDate(order?.next_billing_at)],
              ["Annual maintenance", oneTime ? (order?.maintenance_renewal_at ? `Renews ${fmtDate(order.maintenance_renewal_at)}` : "Not scheduled") : "Not applicable"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-3 py-2.5"><dt className="text-muted-foreground">{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
          <p className="pt-2 font-semibold">Payment history</p>
          {payments.length === 0 ? <p className="text-muted-foreground">No payments recorded.</p> : payments.map((p) => (
            <p key={p.id}>{fmtDate(p.occurred_at)} · {formatEuro(p.amount_cents)} · {p.status}</p>
          ))}
          <p className="pt-2 text-xs text-muted-foreground">Payment records are written only by the payment provider and cannot be edited here.</p>
        </TabsContent>

        <TabsContent value="notes" className="mt-4 space-y-3">
          <Textarea rows={3} placeholder="Add an internal note" value={note} onChange={(e) => setNote(e.target.value)} />
          <Button size="sm" onClick={submitNote}>Add note</Button>
          <ul className="space-y-2">
            {notes.map((n) => (
              <li key={n.id} className="rounded-control border border-border p-3 text-sm">
                <p className="text-xs text-muted-foreground">{n.author_email ?? "Staff"} · {new Date(n.created_at).toLocaleString()}</p>
                <p className="mt-1 whitespace-pre-wrap">{n.content}</p>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </>
  );
}
