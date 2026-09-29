<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->
- Hype Private AI payments go only through `src/lib/private-ai/payment-provider.server.ts` (PaymentProvider); prices are enforced by DB triggers on `pai_orders`, and payment fields are written only by the service role (future webhook). Why: Stripe can be plugged in later without touching product, checkout, app or CRM.
- Private AI pricing/tier copy lives in `src/lib/private-ai/plans.ts` only. Why: one source of truth for the six prices.
