/** Single source of truth for Hype Private AI pricing and tier scope. */
export type Tier = "essential" | "advanced" | "pro";
export type PaymentModel = "one_time" | "monthly";

export const TIERS: Tier[] = ["essential", "advanced", "pro"];
export const MAINTENANCE_CENTS = 25000;

export const PRICES: Record<PaymentModel, Record<Tier, number>> = {
  one_time: { essential: 69900, advanced: 89900, pro: 123900 },
  monthly: { essential: 2900, advanced: 4900, pro: 9900 },
};

export const TIER_INFO: Record<
  Tier,
  { label: string; blurb: string; popular?: boolean; features: string[] }
> = {
  essential: {
    label: "Essential",
    blurb: "One focused assistant for one part of your work.",
    features: [
      "Up to 5 integrations",
      "1 standard role",
      "1 messaging channel",
      "Dedicated deployment",
      "Standard onboarding",
      "Email support",
      "AI usage subject to plan allowance",
    ],
  },
  advanced: {
    label: "Advanced",
    blurb: "More connected tools and a persona tuned to how you work.",
    popular: true,
    features: [
      "Up to 10 integrations + 1 light custom integration",
      "Standard role + persona tuning",
      "2 messaging channels",
      "Dedicated deployment",
      "Enhanced onboarding",
      "Priority support",
      "Higher AI usage allowance",
    ],
  },
  pro: {
    label: "Pro",
    blurb: "Scoped around your business, your tools and your workflows.",
    features: [
      "Custom integration scope, subject to technical feasibility",
      "Custom connectors",
      "Fully custom persona",
      "Custom workflows",
      "All supported messaging channels",
      "Dedicated deployment",
      "Client-owned Google Cloud option, where agreed",
      "Scoped onboarding",
      "Dedicated support relationship",
      "AI usage based on agreed scope",
    ],
  },
};

export const COMPARISON: { label: string; values: Record<Tier, string> }[] = [
  { label: "Integrations", values: { essential: "Up to 5", advanced: "Up to 10 + 1 light custom", pro: "Custom scope, subject to feasibility" } },
  { label: "Custom connectors", values: { essential: "—", advanced: "1 light custom integration", pro: "Included" } },
  { label: "Role and persona", values: { essential: "1 standard role", advanced: "Standard role + persona tuning", pro: "Fully custom persona" } },
  { label: "Custom workflows", values: { essential: "—", advanced: "—", pro: "Included" } },
  { label: "Messaging channels", values: { essential: "1", advanced: "2", pro: "All supported channels" } },
  { label: "Deployment", values: { essential: "Dedicated", advanced: "Dedicated", pro: "Dedicated · client-owned Google Cloud option where agreed" } },
  { label: "Onboarding", values: { essential: "Standard", advanced: "Enhanced", pro: "Scoped" } },
  { label: "Support", values: { essential: "Email", advanced: "Priority", pro: "Dedicated relationship" } },
  { label: "AI usage", values: { essential: "Subject to plan allowance", advanced: "Higher allowance", pro: "Based on agreed scope" } },
];

export function formatEuro(cents: number) {
  const v = cents / 100;
  return `€${v.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function priceLabel(tier: Tier, model: PaymentModel) {
  return `${formatEuro(PRICES[model][tier])}${model === "monthly" ? "/month" : ""}`;
}

export function modelLabel(model: PaymentModel) {
  return model === "one_time" ? "One-time" : "Monthly";
}

export function isTier(v: unknown): v is Tier {
  return v === "essential" || v === "advanced" || v === "pro";
}
export function isModel(v: unknown): v is PaymentModel {
  return v === "one_time" || v === "monthly";
}

export const USE_CASES = ["Executive", "Sales", "Operations", "Lifestyle", "Paralegal", "Other"] as const;

export const STATUS_LABEL: Record<string, string> = {
  account_created: "Account created",
  order_review: "Order review",
  checkout_started: "Checkout started",
  payment_pending: "Payment pending",
  payment_successful: "Payment successful",
  payment_failed: "Payment failed",
  account_active: "Account active",
  setup_pending: "Setup pending",
  setup_in_progress: "Setup in progress",
  ready: "Ready",
  paused: "Paused",
  inactive: "Inactive",
  unpaid: "Unpaid",
  paid: "Paid",
  failed: "Failed",
  not_started: "Not started",
  pending: "Pending",
  in_progress: "In progress",
};
export const ACCOUNT_STATUSES = [
  "account_created",
  "account_active",
  "setup_pending",
  "setup_in_progress",
  "ready",
  "paused",
  "inactive",
] as const;
export const SETUP_STATUSES = ["not_started", "pending", "in_progress", "ready", "paused"] as const;
export const label = (s: string | null | undefined) => (s ? (STATUS_LABEL[s] ?? s) : "—");
