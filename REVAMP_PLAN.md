# Hype Automations — UI Revamp Plan

Governed by `DESIGN_PHILOSOPHY.md`. Decisions confirmed 2026-09-22:

- Scope: landing page only. Booking dialog and admin inherit token, font and contrast fixes; no restyle.
- Sections: merge 14 → 10 as proposed.
- Git: one branch + PR per step, off `main`. CI must be green before merge. Never touch pushed history (Lovable sync).
- Pace: build all six steps, then one review with screenshots.

Working rules: `bun run lint` and `bun run build` after every step. `src/routeTree.gen.ts` is generated and never committed. No raw colour, shadow or sub-12px size values in components.

---

## Step 1 — Foundations `revamp/1-foundations`

Visible improvement, no layout change.

| Change | File | Detail |
|---|---|---|
| Load the brand font | `package.json`, `src/routes/__root.tsx`, `src/styles.css` | Add `@fontsource-variable/plus-jakarta-sans` (5.3.0, on npm). Import once in the root route. Preload the Latin woff2. Keep the family name in `--font-sans` |
| New colour tokens | `src/styles.css` | `--primary-fill: oklch(0.54 0.221 295)` (white text 5.31:1), `--link` = secondary, `--flow` = brand gradient, `--manual` = muted foreground. Register in `@theme inline` |
| Motion tokens | `src/styles.css` | `--motion-micro: 150ms`, `--motion-state: 250ms`, `--motion-run: 450ms`, `--ease-out: cubic-bezier(0.22,1,0.36,1)` |
| Button | `src/components/ui/button.tsx` | `default` uses `bg-primary-fill`; focus ring `focus-visible:ring-2 ring-accent ring-offset-2 ring-offset-background`; `lg` height 48px, radius 10px; remove grey `shadow` |
| Input, dialog close, accordion trigger, tabs | `src/components/ui/*.tsx` | Same cyan focus ring |
| Text floor | all components | Every `text-[0.5rem]`…`text-[0.7rem]` becomes `text-xs` (12px) or `text-sm`. `Logo.tsx` included |
| Metadata | `src/routes/__root.tsx` | Remove `twitter:site: @Lovable`; add `theme-color` |
| CI | `eslint.config.js`, `.prettierignore`, `.gitattributes` | Ignore generated `types.ts` (195 prettier errors were failing CI); force LF line endings |

Done when: lint and build pass, the font renders, primary button passes 4.5:1, no size under 12px.

## Step 2 — De-noise `revamp/2-denoise`

Remove template chrome. Copy unchanged except the call-to-action label.

| Change | Detail |
|---|---|
| Gradient text | Remove all 18 `text-gradient` uses in sections. Two-part headlines use the whole-line muted/full pattern. Exception kept: the "Y" in `Logo.tsx` — it is the wordmark |
| Capital labels | Remove `uppercase tracking-*` in all 22 places; sentence case |
| Button arrows | Remove `ArrowRight`/`PlayCircle` from all buttons |
| Card lifts | Remove `hover:-translate-y-1` and `shadow-[…]` hovers; hover = `border-border-strong` |
| Reveal | Remove every `<Reveal>` below the hero (32 uses). `Reveal.tsx` keeps `useInView` only |
| Glows | Cut `brand-glow` to two: hero and final section |
| One action name | "Book a free consultation" in Navbar (desktop + sheet), Hero, StickyCta, Calculator, FinalCta, LiveWorkflow, dialog title. Secondary links: "See how it works", "See what we automate" |
| Illustrative notes | Replace 10px disclaimers with a shared `ExampleTag` (12px pill, text "Example") |

Done when: greps for `text-gradient` (outside Logo), `uppercase`, `ArrowRight`, `<Reveal` in sections all return 0.

## Step 3 — The run `revamp/3-run`

Rebuild the hero instrument; retire `LiveWorkflow`.

| Change | Detail |
|---|---|
| New `src/components/run/` | `RunNode.tsx` (one step: icon, what happened, status word), `Run.tsx` (ordered list, gradient connector, plays once on first view or on "Send a test lead", then rests on "Run it again"; polite live region announces once per run; reduced motion = final state), `run-steps.ts` (the six steps with story copy from `LiveWorkflow` + `ControlCenter`) |
| Story copy | "Sara filled in the contact form" → "Qualified: budget and timeline fit" → "Added to the CRM" → "WhatsApp sent" → "Follow-up queued for tomorrow" → "Booked Thursday 14:00". Tagged `Example` |
| KPI tiles | Removed |
| `Hero.tsx` | Left: headline, lead, one primary button, one text link. Right: `<Run />`. Reserved height so nothing shifts |
| `LiveWorkflow.tsx`, `ControlCenter.tsx` | Deleted. `#how-it-works` anchor moves to the Process section |
| `index.tsx` | Section list updated |

Done when: the run plays once, replays on click, pauses off screen, announces once, renders complete with reduced motion.

## Step 4 — Rail and section kinds `revamp/4-rail-sections`

| Change | Detail |
|---|---|
| New `src/components/site/Rail.tsx` | Fixed-column vertical line on `lg+`, `aria-hidden`. Segments styled by `data-rail="manual|flow|done"` set per section. Mobile: in the gutter, dropped under 360px |
| New `src/components/site/Section.tsx` | `Statement` (type on background, no container) and `Instrument` (one 20px-radius panel). Both take `rail` prop |
| Merges | `Problem` + `BeforeAfter` → `BrokenChain.tsx` (six "someone has to" statements as a dashed chain, then one solid chain). `WhatWeAutomate` + `Benefits` → `WhatWeAutomate.tsx` (category explorer; the six benefits become a plain list beside it). `Process` + `Trust` → `HowItWorks.tsx` (four numbered steps — a real sequence — plus "what the call covers"). `LiveWorkflow` already gone |
| Restyled in place | `PatternInterrupt`, `Integrations`, `UseCases`, `Calculator`, `Faq`, `FinalCta` (centre-aligned, green rail end) |
| Radii | Panels 20px, controls 10px, pills full. Replace `rounded-2xl`/`rounded-3xl` accordingly |
| Type scale | Apply the display/statement/title/lead scale from the philosophy with `clamp()` and `text-wrap: balance` |
| Deleted | `BeforeAfter.tsx`, `Benefits.tsx`, `Problem.tsx`, `Process.tsx`, `Trust.tsx` |

Done when: page is 10 sections, rail changes state at the automation boundary, no `Reveal` in sections.

## Step 5 — Chrome and booking touchpoints `revamp/5-chrome`

Landing-scope only; the booking flow itself is not restyled.

| Change | Detail |
|---|---|
| `Navbar.tsx` | Glass on scroll kept; links match the new section ids; one button label |
| `StickyCta.tsx` | Safe-area inset; label "Book a free consultation"; 44px target |
| `Footer.tsx` | Sentence case, no capitals |
| `BookingDialog.tsx` | Title only: "Book a free consultation" |
| Open Graph | `public/og.png` (1200×630, dark, wordmark) referenced from `__root.tsx` and `index.tsx` |

## Step 6 — Review `revamp/6-review`

| Check | How |
|---|---|
| Lint, build | `bun run lint && bun run build` |
| Screenshots | Dev server, 375 / 768 / 1024 / 1440, light-touch review against the checklist in the philosophy |
| Reduced motion | Emulate `prefers-reduced-motion`, confirm run renders complete and nothing moves |
| Accessibility | `design:accessibility-review` pass: contrast, focus order, headings, dialog focus trap, live region |
| Fixes | Anything found, committed on this branch |

Final report: per-step PR links, before/after screenshots, open items.

---

## Out of scope

Booking flow restyle, admin density pass, real proof content (logos, testimonials) — added by the business when available.
