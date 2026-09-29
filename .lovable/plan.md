# Make Hype Private AI the flagship homepage

## Outcome
- Make `/` the complete Hype Private AI product journey, with the existing Private AI hero, storytelling, role, ecosystem, control, privacy, pricing, and conversion components reused rather than rebuilt.
- Keep `/private-ai` working as an inbound product URL, presenting the same flagship experience without disrupting checkout, authentication, customer workspace, admin CRM, analytics, or the future payment boundary.
- Move the current general automation experience to a new `/custom-workflows` page with its own consultation-first funnel.

## Homepage and Private AI funnel
- Adapt the existing Private AI hero to the exact requested copy and four-stage illustrative status language, retain the tool-connected intelligence visual, and add the secondary Custom Workflows link.
- Assemble the homepage in this order: hero, dashboard pattern interrupt, operator comparison, request examples, roles, ecosystem, control, privacy, exact pricing/comparison, Custom Workflows bridge, final Private AI CTA.
- Keep every Private AI purchase CTA pointed to the existing plan selection and checkout flow, preserving UTM capture and all six plan combinations.
- Use a shared flagship-page composition for `/` and `/private-ai` so the content cannot drift while both URLs remain valid.

## Custom Workflows product page
- Create `/custom-workflows` with unique metadata and preserve the current homepage’s strongest assets: booking system, animated workflow demo, problem framing, automation categories, integrations, use cases, calculator, delivery process, FAQ, and consultation CTA.
- Update its hero to the requested HYPE CUSTOM WORKFLOWS positioning and consultation-first actions.
- Add the overdue-invoice workflow example and maintain a clear distinction from the Private AI operator.

## Navigation and cross-product hierarchy
- Replace the current mixed navigation with a shared product-aware header: Products menu containing Hype Private AI and Hype Custom Workflows, plus contextual capability/how-it-works/pricing links and the correct primary CTA for each funnel.
- Build an intentional mobile menu with full-width touch targets and clear flagship labeling.
- Add a secondary homepage bridge to `/custom-workflows` with the Lead → AI Qualification → CRM → Follow-Up → Booking mini-flow.
- Update footers and cross-links so all links work from both routes and no hash link points to a section on the wrong page.

## Safeguards and validation
- Keep pricing sourced only from the existing plan module: €699/€899/€1,239 plus €250/year for one-time; €29/€49/€99 monthly with no maintenance fee.
- Audit customer-facing code for the internal codename, unsupported Private AI WhatsApp/current voice claims, fake AI behavior, and Setup Pending regressions.
- Preserve the existing custom-workflow WhatsApp content only on the separate Custom Workflows service page, where it describes that distinct offering.
- Verify `/`, `/private-ai`, `/custom-workflows`, checkout entry, sign-in links, and consultation opening at 375, 390, 430, 768, 1024, and 1440+ widths; fix overflow, nav, visual, table, and CTA issues found.
- Confirm route metadata, preview build health, console/runtime errors, pricing consistency, and responsive first-viewport hierarchy before completion.

## Technical details
- Add a reusable Private AI page composition and a reusable product navigation variant instead of duplicating full route markup.
- Add the new TanStack route file and let route generation update automatically.
- Keep payment, authentication, customer workspace, admin, and database code unchanged unless validation finds a hierarchy-related regression.
