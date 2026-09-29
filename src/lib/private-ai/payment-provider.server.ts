/**
 * Payment integration boundary. The rest of the product only talks to `getPaymentProvider()`.
 * To go live: implement a StripeProvider (Checkout Session for one_time/monthly, webhook route under
 * src/routes/api/public/ that verifies signatures, writes pai_payments idempotently by provider_event_id,
 * and updates pai_orders/pai_customers with the service role). Nothing else needs to change.
 */
import type { PaymentModel, Tier } from "./plans";

export type CheckoutOrder = {
  orderId: string;
  userId: string;
  email: string | null;
  tier: Tier;
  model: PaymentModel;
  amountCents: number;
  maintenanceCents: number | null;
  currency: string;
  successUrl: string;
  cancelUrl: string;
};

export type CheckoutResult =
  | { status: "redirect"; url: string; providerCheckoutId: string }
  | { status: "not_configured"; message: string };

export interface PaymentProvider {
  readonly name: string;
  startCheckout(order: CheckoutOrder): Promise<CheckoutResult>;
  customerPortalUrl(providerCustomerId: string, returnUrl: string): Promise<string | null>;
}

/** Development-safe provider: never charges, never fabricates a payment. */
const pendingProvider: PaymentProvider = {
  name: "pending",
  async startCheckout() {
    return {
      status: "not_configured",
      message: "Secure payment integration will be enabled before launch.",
    };
  },
  async customerPortalUrl() {
    return null;
  },
};

export function getPaymentProvider(): PaymentProvider {
  return pendingProvider;
}
