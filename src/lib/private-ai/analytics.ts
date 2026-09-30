/** Analytics hooks + UTM attribution. Provider-agnostic: pushes to window.dataLayer when present. */
export type PaiEvent =
  | "private_ai_hero_view"
  | "private_ai_cta_click"
  | "role_selected"
  | "pricing_view"
  | "pricing_toggle"
  | "plan_selected"
  | "purchase_started"
  | "signup_started"
  | "signup_completed"
  | "google_auth_started"
  | "login_completed"
  | "checkout_started"
  | "checkout_completed"
  | "checkout_failed"
  | "app_opened"
  | "billing_viewed"
  | "demo_interaction"
  | "form_started"
  | "form_validation_error"
  | "form_completed"
  | "setup_continued"
  | "custom_workflows_cta_click";

export function track(event: PaiEvent, props: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event, ...props });
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>;
const UTM_STORE = "hpa_utm";

export function captureUtm() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const found: Utm = {};
  for (const k of UTM_KEYS) {
    const v = params.get(k);
    if (v) found[k] = v.slice(0, 200);
  }
  if (Object.keys(found).length) localStorage.setItem(UTM_STORE, JSON.stringify(found));
}

export function readUtm(): Utm {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(UTM_STORE) ?? "{}") as Utm;
  } catch {
    return {};
  }
}
