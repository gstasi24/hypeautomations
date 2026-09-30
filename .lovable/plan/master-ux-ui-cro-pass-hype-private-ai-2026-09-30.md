# Master UX / UI / CRO Pass — Hype Private AI

## Goal
Turn the current customer journey into a premium product reveal that moves from curiosity to understanding, trust, plan selection, and setup without changing pricing, backend rules, payment boundaries, or the setup-pending AI boundary.

## Implementation
1. **Unify the interaction system**
   - Strengthen primary, secondary, and tertiary action hierarchy; add tactile states, consistent focus treatment, and 44px touch targets.
   - Add reusable one-time reveal, scroll-progress, spotlight, and reduced-motion-safe utilities using transforms, opacity, IntersectionObserver, and CSS variables.
   - Add provider-neutral analytics hooks for demo interactions, form starts/errors/completions, checkout initiation, and setup continuation.

2. **Recompose the Private AI homepage as eight scenes**
   - Compact translucent navigation with one dominant plan-selection action.
   - Rebuild the hero around an interactive Hype intelligence core and one clear promise.
   - Create a request → understand → act → report demonstration that progresses with scroll but remains fully visible in reduced-motion mode.
   - Convert capabilities into a focused sticky desktop story and a concise touch-first mobile sequence.
   - Make personalization tangible through an accessible interactive operations map.
   - Compress outcomes into defensible qualitative statements only.
   - Combine privacy, onboarding, approval, and post-purchase expectations into one clear trust/control sequence before pricing.
   - Simplify pricing comparisons while preserving all six exact prices and maintenance rules, then end with one action and minimal footer competition.

3. **Improve the conversion path**
   - Clarify every pricing CTA with its next step.
   - Simplify checkout progress and decision surfaces without removing required customer data.
   - Add visible inline validation and recovery guidance, loading/success feedback, appropriate autocomplete/input modes, and analytics events.
   - Preserve selected plan, UTM attribution, order state, account flows, payment abstraction, and saved-order behavior.

4. **Align Custom Workflows**
   - Apply the same navigation, buttons, forms, reveal motion, and accessibility grammar while keeping consultation as its sole primary conversion goal.
   - Keep cross-links intentional and visually secondary.

5. **Quality gate**
   - Verify public routes, navigation, anchors, all CTAs, plan selection, checkout handoff, back navigation, form states, keyboard flow, reduced motion, touch/hover behavior, and overflow.
   - Test 375, 390, 430, 768, 1024, 1440, and wide desktop widths with short and tall viewports.
   - Re-audit exact pricing, maintenance disclosure, public naming, unsupported claims, Setup Pending, live-payment boundary, and absence of fake AI behavior.

## Technical details
- Keep `PrivateAiExperience` shared by `/` and `/private-ai` and retain `/custom-workflows` as the separate consultation funnel.
- Keep pricing and tier copy sourced only from `src/lib/private-ai/plans.ts`.
- Keep payment behavior behind `PaymentProvider`; no live Stripe implementation.
- Use existing Tailwind v4 semantic tokens and shadcn controls; introduce any new visual roles only as semantic tokens in `src/styles.css`.
- Use CSS/IntersectionObserver for motion; no new heavy animation dependency unless a sequence proves impossible without one.
