import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { track } from "@/lib/private-ai/analytics";
import {
  COMPARISON,
  MAINTENANCE_CENTS,
  PRICES,
  TIERS,
  TIER_INFO,
  formatEuro,
  priceLabel,
  type PaymentModel,
  type Tier,
} from "@/lib/private-ai/plans";

export function ModelToggle({
  model,
  onChange,
}: {
  model: PaymentModel;
  onChange: (m: PaymentModel) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Payment model" className="inline-flex rounded-full border border-border bg-surface p-1">
      {(["one_time", "monthly"] as const).map((m) => (
        <button
          key={m}
          role="radio"
          aria-checked={model === m}
          onClick={() => onChange(m)}
          className={cn(
            "rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-colors",
            model === m ? "bg-brand-gradient text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {m === "one_time" ? "One-time" : "Monthly"}
        </button>
      ))}
    </div>
  );
}

export function Pricing() {
  const [model, setModel] = useState<PaymentModel>("one_time");
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) {
        track("pricing_view");
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="pricing" ref={ref} className="relative scroll-mt-20 py-16 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-5 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <h2 className="type-statement max-w-3xl">Choose your private AI.</h2>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Own it with a one-time setup, or keep it all-inclusive monthly.
          </p>
          <div className="mt-8">
            <ModelToggle
              model={model}
              onChange={(m) => {
                setModel(m);
                track("pricing_toggle", { model: m });
              }}
            />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {model === "one_time"
              ? `One-time plans include a ${formatEuro(MAINTENANCE_CENTS)}/year maintenance renewal.`
              : "All-inclusive. No annual maintenance fee."}
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <PlanCard key={tier} tier={tier} model={model} />
          ))}
        </div>

        <Comparison />
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Voice is on the roadmap and not currently available. Messaging channels exclude WhatsApp.
          Integrations depend on plan and technical requirements.
        </p>
      </div>
    </section>
  );
}

function PlanCard({ tier, model }: { tier: Tier; model: PaymentModel }) {
  const info = TIER_INFO[tier];
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-panel border bg-surface p-6 sm:p-7",
        info.popular ? "border-primary/60 glow-ring" : "border-border",
      )}
    >
      {info.popular && (
        <span className="absolute -top-3 left-6 rounded-full bg-brand-gradient px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground">
          Most popular
        </span>
      )}
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-link">{info.label}</p>
      <p className="mt-2 text-sm text-muted-foreground">{info.blurb}</p>
      <p className="mt-6 text-4xl font-extrabold tracking-tight">
        {formatEuro(pricesFor(tier, model))}
        {model === "monthly" && <span className="text-base font-medium text-muted-foreground">/month</span>}
      </p>
      <p className="mt-1 min-h-5 text-sm text-muted-foreground">
        {model === "one_time" ? `+ ${formatEuro(MAINTENANCE_CENTS)}/year maintenance renewal` : "All-inclusive"}
      </p>
      <ul className="mt-6 flex-1 space-y-2.5 text-sm">
        {info.features.map((f) => (
          <li key={f} className="flex gap-2.5">
            <Check className="mt-0.5 size-4 shrink-0 text-success" />
            {f}
          </li>
        ))}
      </ul>
      <Button
        className="mt-7 w-full"
        variant={info.popular ? "default" : "outline"}
        asChild
        onClick={() => track("plan_selected", { tier, model, price: priceLabel(tier, model) })}
      >
        <Link to="/private-ai/checkout" search={{ tier, model }}>
          Choose {info.label}
        </Link>
      </Button>
    </div>
  );
}

function pricesFor(tier: Tier, model: PaymentModel) {
  return PRICES[model][tier];
}

function Comparison() {
  const [mobileTier, setMobileTier] = useState<Tier>("advanced");
  return (
    <div className="mt-14">
      <h3 className="type-title text-center">Compare plans</h3>
      {/* Mobile: one tier at a time */}
      <div className="mt-6 lg:hidden">
        <div className="grid grid-cols-3 gap-1 rounded-control border border-border bg-surface p-1">
          {TIERS.map((t) => (
            <button
              key={t}
              onClick={() => setMobileTier(t)}
              className={cn(
                "rounded-md py-2 text-xs font-semibold uppercase tracking-wider",
                mobileTier === t ? "bg-surface-2 text-foreground" : "text-muted-foreground",
              )}
            >
              {TIER_INFO[t].label}
            </button>
          ))}
        </div>
        <dl className="mt-4 divide-y divide-border rounded-panel border border-border bg-surface">
          {COMPARISON.map((row) => (
            <div key={row.label} className="flex justify-between gap-4 px-4 py-3 text-sm">
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd className="text-right">{row.values[mobileTier]}</dd>
            </div>
          ))}
        </dl>
      </div>
      {/* Desktop table */}
      <div className="mt-6 hidden overflow-hidden rounded-panel border border-border lg:block">
        <table className="w-full text-sm">
          <thead className="bg-surface">
            <tr>
              <th className="p-4 text-left font-medium text-muted-foreground">Feature</th>
              {TIERS.map((t) => (
                <th key={t} className="p-4 text-left text-xs font-bold uppercase tracking-[0.2em] text-link">
                  {TIER_INFO[t].label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {COMPARISON.map((row) => (
              <tr key={row.label}>
                <td className="p-4 text-muted-foreground">{row.label}</td>
                {TIERS.map((t) => (
                  <td key={t} className="p-4">{row.values[t]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
