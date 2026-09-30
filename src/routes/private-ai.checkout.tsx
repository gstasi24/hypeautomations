import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { toast } from "sonner";
import { Check, Loader2, Lock, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductNav } from "@/components/private-ai/ProductNav";
import { ModelToggle } from "@/components/private-ai/Pricing";
import { cn } from "@/lib/utils";
import { captureUtm, readUtm, track } from "@/lib/private-ai/analytics";
import {
  MAINTENANCE_CENTS,
  PRICES,
  TIERS,
  TIER_INFO,
  USE_CASES,
  formatEuro,
  isModel,
  isTier,
  modelLabel,
  priceLabel,
  type PaymentModel,
  type Tier,
} from "@/lib/private-ai/plans";
import {
  getMyAccount,
  saveCustomerDetails,
  startCheckout,
  upsertOrder,
} from "@/lib/private-ai/private-ai.functions";

const STEPS = ["plan", "account", "details", "review", "payment"] as const;
type Step = (typeof STEPS)[number];
const STEP_LABEL: Record<Step, string> = {
  plan: "Your plan",
  account: "Account",
  details: "Details",
  review: "Order review",
  payment: "Payment",
};
const PLAN_STORE = "hpa_plan";

const searchSchema = z.object({
  tier: z.enum(["essential", "advanced", "pro"]).optional().catch(undefined),
  model: z.enum(["one_time", "monthly"]).optional().catch(undefined),
  step: z.enum(STEPS).optional().catch(undefined),
});

export const Route = createFileRoute("/private-ai/checkout")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Checkout | Hype Private AI" },
      { name: "description", content: "Review your Hype Private AI plan, create your account and confirm your order." },
      { property: "og:title", content: "Checkout | Hype Private AI" },
      { property: "og:description", content: "Choose your plan and set up your private AI account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/private-ai/checkout" });
  const [plan, setPlan] = useState<{ tier: Tier; model: PaymentModel }>({ tier: "advanced", model: "one_time" });
  const [session, setSession] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const step: Step = search.step ?? "plan";

  // Restore selection: URL wins, then saved draft.
  useEffect(() => {
    captureUtm();
    let saved: Partial<{ tier: Tier; model: PaymentModel }> = {};
    try {
      saved = JSON.parse(localStorage.getItem(PLAN_STORE) ?? "{}");
    } catch {}
    const tier = isTier(search.tier) ? search.tier : isTier(saved.tier) ? saved.tier : "advanced";
    const model = isModel(search.model) ? search.model : isModel(saved.model) ? saved.model : "one_time";
    setPlan({ tier, model });
    track("purchase_started", { tier, model });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(PLAN_STORE, JSON.stringify(plan));
  }, [plan]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(Boolean(data.session));
      setEmail(data.session?.user.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(Boolean(s));
      setEmail(s?.user.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const go = (s: Step) => navigate({ search: { tier: plan.tier, model: plan.model, step: s } });

  // Guard: steps after account need a session.
  useEffect(() => {
    if (session === false && (step === "details" || step === "review" || step === "payment")) go("account");
    if (session === true && step === "account") go("details");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, step]);

  const idx = STEPS.indexOf(step);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProductNav minimal />
      <main className="mx-auto w-full max-w-5xl px-5 pb-24 pt-24 lg:px-8 lg:pt-28">
        <ol className="flex gap-1.5 overflow-x-auto pb-2" aria-label="Checkout progress">
          {STEPS.map((s, i) => (
            <li
              key={s}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs",
                i < idx && "border-primary/40",
                i === idx && "border-transparent bg-brand-gradient text-primary-foreground",
                i > idx && "border-border text-muted-foreground",
              )}
              aria-current={i === idx ? "step" : undefined}
            >
              {i < idx ? <Check className="size-3" /> : <span>{i + 1}</span>}
              {STEP_LABEL[s]}
            </li>
          ))}
        </ol>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="min-w-0">
            {step === "plan" && (
              <PlanStep plan={plan} setPlan={setPlan} onNext={() => go(session ? "details" : "account")} />
            )}
            {step === "account" && <AccountStep plan={plan} onBack={() => go("plan")} />}
            {step === "details" && session && <DetailsStep plan={plan} onBack={() => go("plan")} onNext={() => go("review")} />}
            {(step === "review" || step === "payment") && session && (
              <ReviewStep
                plan={plan}
                email={email}
                paying={step === "payment"}
                onEdit={() => go("details")}
                onChangePlan={() => go("plan")}
                onPay={() => go("payment")}
              />
            )}
            {session === null && step !== "plan" && <Loader2 className="size-5 animate-spin text-muted-foreground" />}
          </div>
          <Summary plan={plan} />
        </div>
      </main>
    </div>
  );
}

function Summary({ plan }: { plan: { tier: Tier; model: PaymentModel } }) {
  const oneTime = plan.model === "one_time";
  return (
    <aside className="h-fit rounded-panel border border-border bg-surface p-6 lg:sticky lg:top-24">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Order summary</p>
      <p className="mt-3 text-lg font-bold">Hype Private AI · {TIER_INFO[plan.tier].label}</p>
      <p className="text-sm text-muted-foreground">{modelLabel(plan.model)}</p>
      <div className="mt-5 flex items-baseline justify-between border-t border-border pt-4">
        <span className="text-sm text-muted-foreground">Due today</span>
        <span className="text-2xl font-extrabold">{formatEuro(PRICES[plan.model][plan.tier])}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {oneTime
          ? `Plus ${formatEuro(MAINTENANCE_CENTS)}/year maintenance renewal. Not charged today; the renewal date is confirmed before it applies.`
          : `Then ${priceLabel(plan.tier, plan.model)}, all-inclusive. No annual maintenance fee.`}
      </p>
      <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="size-3.5" /> We never see or store your card details.
      </p>
    </aside>
  );
}

function PlanStep({
  plan,
  setPlan,
  onNext,
}: {
  plan: { tier: Tier; model: PaymentModel };
  setPlan: (p: { tier: Tier; model: PaymentModel }) => void;
  onNext: () => void;
}) {
  return (
    <section>
      <h1 className="type-title text-2xl">Your plan</h1>
      <div className="mt-5">
        <ModelToggle model={plan.model} onChange={(model) => setPlan({ ...plan, model })} />
      </div>
      <div className="mt-5 space-y-3" role="radiogroup" aria-label="Tier">
        {TIERS.map((t) => (
          <button
            key={t}
            role="radio"
            aria-checked={plan.tier === t}
            onClick={() => setPlan({ ...plan, tier: t })}
            className={cn(
              "flex w-full items-center justify-between gap-4 rounded-panel border p-5 text-left transition-colors",
              plan.tier === t ? "border-primary/70 bg-surface" : "border-border hover:border-border-strong",
            )}
          >
            <span>
              <span className="block text-xs font-bold uppercase tracking-[0.22em] text-link">{TIER_INFO[t].label}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{TIER_INFO[t].blurb}</span>
            </span>
            <span className="text-right">
              <span className="block text-xl font-extrabold">{priceLabel(t, plan.model)}</span>
              {plan.model === "one_time" && (
                <span className="block text-xs text-muted-foreground">+ {formatEuro(MAINTENANCE_CENTS)}/year maintenance</span>
              )}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <Link to="/private-ai" hash="pricing" className="text-sm text-muted-foreground hover:text-foreground">
          Compare plans
        </Link>
        <Button size="lg" onClick={onNext}>Continue</Button>
      </div>
    </section>
  );
}

function AccountStep({ plan, onBack }: { plan: { tier: Tier; model: PaymentModel }; onBack: () => void }) {
  const [mode, setMode] = useState<"signup" | "signin" | "forgot">("signup");
  const [f, setF] = useState({ first: "", last: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const returnUrl = () =>
    `${window.location.origin}/private-ai/checkout?tier=${plan.tier}&model=${plan.model}&step=details`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setNotice(null);
    setError(null);
    try {
      if (mode === "signup") {
        if (f.password !== f.confirm) throw new Error("Passwords don't match. Re-enter both passwords and try again.");
        track("signup_started", { method: "email" });
        const { data, error } = await supabase.auth.signUp({
          email: f.email,
          password: f.password,
          options: {
            emailRedirectTo: returnUrl(),
            data: { first_name: f.first, last_name: f.last, full_name: `${f.first} ${f.last}`.trim() },
          },
        });
        if (error) throw error;
        if (data.user && data.user.identities?.length === 0) {
          setMode("signin");
          throw new Error("An account with this email already exists. Sign in instead.");
        }
        track("signup_completed", { method: "email" });
        if (!data.session) setNotice("Check your inbox to confirm your email. Your plan selection is saved.");
      } else if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email: f.email, password: f.password });
        if (error) throw error;
        track("login_completed", { method: "email" });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(f.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setNotice("If an account exists for this email, a reset link is on its way.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
      track("form_validation_error", { form: "account", mode, reason: message });
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    track("google_auth_started");
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: returnUrl() });
    if (res.error) toast.error("Google sign-in is unavailable right now.");
  }

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  return (
    <section>
      <h1 className="type-title text-2xl">
        {mode === "signup" ? "Create your account" : mode === "signin" ? "Sign in" : "Reset your password"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Your plan selection is kept while you sign in.</p>

      {mode !== "forgot" && (
        <>
          <Button variant="outline" className="mt-6 w-full" onClick={google}>Continue with Google</Button>
          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>
        </>
      )}

      <form onSubmit={submit} onFocus={() => { if (!started) { setStarted(true); track("form_started", { form: "account", mode }); } }} className={cn("space-y-4", mode === "forgot" && "mt-6")} noValidate>
        {mode === "signup" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="first" label="First name"><Input id="first" required autoComplete="given-name" value={f.first} onChange={set("first")} /></Field>
            <Field id="last" label="Last name"><Input id="last" required autoComplete="family-name" value={f.last} onChange={set("last")} /></Field>
          </div>
        )}
        <Field id="email" label="Email"><Input id="email" type="email" required autoComplete="email" value={f.email} onChange={set("email")} /></Field>
        {mode !== "forgot" && (
          <Field id="password" label="Password">
            <Input id="password" type="password" required minLength={8} autoComplete={mode === "signup" ? "new-password" : "current-password"} value={f.password} onChange={set("password")} />
          </Field>
        )}
        {mode === "signup" && (
          <Field id="confirm" label="Confirm password">
            <Input id="confirm" type="password" required minLength={8} autoComplete="new-password" value={f.confirm} onChange={set("confirm")} aria-invalid={Boolean(f.confirm && f.password !== f.confirm)} aria-describedby="confirm-help" />
            <p id="confirm-help" className={cn("text-xs", f.confirm && f.password !== f.confirm ? "text-destructive" : "text-muted-foreground")}>
              {f.confirm && f.password !== f.confirm ? "Passwords do not match yet." : "Use at least 8 characters."}
            </p>
          </Field>
        )}
        {notice && <p role="status" className="rounded-control border border-success/40 p-3 text-sm text-success">{notice}</p>}
        {error && <p role="alert" className="rounded-control border border-destructive/40 p-3 text-sm text-destructive">{error}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          {mode === "signup" ? "Create account" : mode === "signin" ? "Sign in" : "Send reset link"}
        </Button>
      </form>

      <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm text-muted-foreground">
        <button onClick={onBack} className="hover:text-foreground">Back to plan</button>
        <div className="flex gap-4">
          {mode !== "signin" && <button onClick={() => setMode("signin")} className="hover:text-foreground">I have an account</button>}
          {mode !== "signup" && <button onClick={() => setMode("signup")} className="hover:text-foreground">Create account</button>}
          {mode === "signin" && <button onClick={() => setMode("forgot")} className="hover:text-foreground">Forgot password?</button>}
        </div>
      </div>
    </section>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

function DetailsStep({
  plan,
  onBack,
  onNext,
}: {
  plan: { tier: Tier; model: PaymentModel };
  onBack: () => void;
  onNext: () => void;
}) {
  const fetchAccount = useServerFn(getMyAccount);
  const save = useServerFn(saveCustomerDetails);
  const order = useServerFn(upsertOrder);
  const [f, setF] = useState({ company_name: "", phone: "", country: "", website: "", use_case: "" as string, ack: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    fetchAccount().then(({ customer }) => {
      if (customer)
        setF((p) => ({
          ...p,
          company_name: customer.company_name ?? "",
          phone: customer.phone ?? "",
          country: customer.country ?? "",
          website: customer.website ?? "",
          use_case: customer.use_case ?? "",
          ack: customer.acknowledged,
        }));
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!f.use_case) { setError("Choose the primary use case that best matches your setup."); track("form_validation_error", { form: "customer_details", field: "use_case" }); return; }
    if (!f.ack) { setError("Confirm that setup depends on your plan and technical requirements."); track("form_validation_error", { form: "customer_details", field: "acknowledgement" }); return; }
    setLoading(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      const meta = (u.user?.user_metadata ?? {}) as Record<string, string>;
      const [gFirst, ...gRest] = (meta["full_name"] ?? meta["name"] ?? "").split(" ");
      const utm = readUtm();
      await save({
        data: {
          first_name: meta["first_name"] ?? gFirst ?? undefined,
          last_name: meta["last_name"] ?? (gRest.join(" ") || undefined),
          company_name: f.company_name,
          phone: f.phone,
          country: f.country,
          website: f.website || undefined,
          use_case: f.use_case as (typeof USE_CASES)[number],
          acknowledged: true,
          utm,
        },
      });
      await order({ data: { tier: plan.tier, payment_model: plan.model, utm } });
      track("form_completed", { form: "customer_details", tier: plan.tier, model: plan.model });
      onNext();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Couldn't save your details. Check the form and try again.";
      setError(message);
      track("form_validation_error", { form: "customer_details", reason: message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h1 className="type-title text-2xl">Customer details</h1>
      <form onSubmit={submit} onFocus={() => { if (!started) { setStarted(true); track("form_started", { form: "customer_details" }); } }} className="mt-6 space-y-4">
        <Field id="company" label="Company name">
          <Input id="company" required autoComplete="organization" value={f.company_name} onChange={(e) => setF({ ...f, company_name: e.target.value })} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="phone" label="Phone">
            <Input id="phone" type="tel" required autoComplete="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
          </Field>
          <Field id="country" label="Country">
            <Input id="country" required autoComplete="country-name" value={f.country} onChange={(e) => setF({ ...f, country: e.target.value })} />
          </Field>
        </div>
        <Field id="website" label="Website (optional)">
          <Input id="website" type="text" inputMode="url" autoComplete="url" value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} />
        </Field>
        <div className="space-y-2">
          <Label>Primary use case</Label>
           <Select value={f.use_case} onValueChange={(v) => setF({ ...f, use_case: v })}>
             <SelectTrigger aria-invalid={Boolean(error && !f.use_case)}><SelectValue placeholder="Choose one" /></SelectTrigger>
            <SelectContent>
              {USE_CASES.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
         <label className="flex min-h-11 items-start gap-3 rounded-control border border-border p-4 text-sm">
          <Checkbox checked={f.ack} onCheckedChange={(v) => setF({ ...f, ack: v === true })} className="mt-0.5" />
          <span className="text-muted-foreground">
            I understand that setup and integrations depend on my plan and on technical requirements, and are completed during onboarding.
          </span>
        </label>
         {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <div className="flex items-center justify-between">
          <button type="button" onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground">Change plan</button>
          <Button type="submit" size="lg" disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" />} Review order
          </Button>
        </div>
      </form>
    </section>
  );
}

function ReviewStep({
  plan,
  email,
  paying,
  onEdit,
  onChangePlan,
  onPay,
}: {
  plan: { tier: Tier; model: PaymentModel };
  email: string | null;
  paying: boolean;
  onEdit: () => void;
  onChangePlan: () => void;
  onPay: () => void;
}) {
  const fetchAccount = useServerFn(getMyAccount);
  const order = useServerFn(upsertOrder);
  const checkout = useServerFn(startCheckout);
  const [data, setData] = useState<Awaited<ReturnType<typeof getMyAccount>> | null>(null);
  const [orderRow, setOrderRow] = useState<Awaited<ReturnType<typeof upsertOrder>> | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "pending">("idle");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const acc = await fetchAccount();
      setData(acc);
      if (!acc.customer?.acknowledged) return onEdit();
      const o = await order({ data: { tier: plan.tier, payment_model: plan.model, utm: readUtm() } });
      setOrderRow(o);
    })().catch((e) => toast.error(e instanceof Error ? e.message : "Couldn't load your order"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan.tier, plan.model]);

  const c = data?.customer;
  const today = useMemo(() => (orderRow ? formatEuro(orderRow.amount_cents) : "…"), [orderRow]);

  async function pay() {
    if (!orderRow) return;
    setState("loading");
    track("checkout_started", { tier: plan.tier, model: plan.model });
    try {
      const res = await checkout({ data: { orderId: orderRow.id, origin: window.location.origin } });
      if (res.status === "redirect") {
        window.location.href = res.url;
        return;
      }
      setMsg(res.message);
      setState("pending");
      track("setup_continued", { tier: plan.tier, model: plan.model, payment: "pending_configuration" });
      onPay();
    } catch (e) {
      track("checkout_failed", { reason: e instanceof Error ? e.message : "unknown" });
      toast.error(e instanceof Error ? e.message : "Checkout couldn't start");
      setState("idle");
    }
  }

  return (
    <section>
      <h1 className="type-title text-2xl">Order review</h1>
      <dl className="mt-6 divide-y divide-border rounded-panel border border-border bg-surface text-sm">
        <Row k="Product" v={`Hype Private AI · ${TIER_INFO[plan.tier].label}`} />
        <Row k="Payment model" v={modelLabel(plan.model)} />
        <Row k="Due today" v={today} strong />
        <Row
          k="Renewal terms"
          v={
            plan.model === "one_time"
              ? `${formatEuro(MAINTENANCE_CENTS)}/year maintenance renewal. Not charged today.`
              : `${priceLabel(plan.tier, plan.model)}, billed monthly. No annual maintenance fee.`
          }
        />
        <Row k="Customer" v={c ? `${[c.first_name, c.last_name].filter(Boolean).join(" ") || "—"} · ${email ?? c.email ?? ""}` : "…"} />
        <Row k="Company" v={c ? `${c.company_name ?? "—"}${c.country ? ` · ${c.country}` : ""}` : "…"} />
        <Row k="Phone" v={c?.phone ?? "…"} />
        <Row k="Primary use case" v={c?.use_case ?? "…"} />
      </dl>
      <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
        <button onClick={onChangePlan} className="hover:text-foreground">Change plan</button>
        <button onClick={onEdit} className="hover:text-foreground">Edit details</button>
      </div>

      {paying && state === "pending" ? (
         <div className="mt-6 rounded-panel border border-primary/40 bg-surface p-6" role="status" aria-live="polite">
          <p className="flex items-center gap-2 font-semibold"><ShieldCheck className="size-5 text-link" /> {msg}</p>
           <p className="mt-2 text-sm text-muted-foreground">
            Your order is saved exactly as shown above. No payment has been taken. We'll let you know when secure checkout opens.
          </p>
          <Button variant="outline" className="mt-5" asChild><Link to="/app">Go to your account</Link></Button>
        </div>
      ) : (
        <Button size="lg" className="mt-6 w-full" disabled={!orderRow || state === "loading"} onClick={pay}>
          {state === "loading" && <Loader2 className="size-4 animate-spin" />}
          <Lock className="size-4" /> Continue to secure payment
        </Button>
      )}
    </section>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:justify-between sm:gap-6">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className={cn("sm:text-right", strong && "text-lg font-bold")}>{v}</dd>
    </div>
  );
}
