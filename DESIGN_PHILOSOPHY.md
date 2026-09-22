# Hype Automations — Design Philosophy

Status: proposal for the UI revamp. Nothing in `src/` has changed yet.
Scope: the public landing page, the booking flow, and the admin area.
Stack it must live in: TanStack Start, React 19, Tailwind v4 (`@theme` tokens in `src/styles.css`), shadcn/ui on Radix, lucide icons.

This document says what the redesign keeps, what it changes, and the rules every new screen is judged against. It is written so that a designer, a developer, or an AI editor (Lovable, Claude) can make a decision without asking.

---

## 1. The idea in one sentence

**Show one line of work running from a new lead to a booked meeting, and let that line be the only thing on the page that glows.**

Hype Automations sells one thing: work that used to need a person now moves by itself. The subject's own world is a workflow — a trigger, a few steps, an outcome. So the site's identity is a single continuous line, called **the run**, that starts in the hero and ends at the booking confirmation. Everything else on the page is quiet so the run can be the memorable thing.

Audience: owners and operators of small and mid-sized service businesses. They are not technical, they are busy, and they have seen plenty of "AI agency" pages. They need to understand what happens to a lead in ten seconds, and they need a reason to believe it.

The page has one job: get a qualified visitor to book a free consultation.

---

## 2. What we keep

These are the core themes. The revamp does not touch them.

| Theme | Where it lives today | Decision |
|---|---|---|
| Dark, near-black indigo base | `--background`, `--surface`, `--surface-2` | Keep values exactly |
| Purple to cyan brand gradient | `--gradient-brand`, `--primary`, `--accent` | Keep values; change where it is allowed to appear (section 5) |
| Plus Jakarta Sans | `--font-sans`, `--font-display` | Keep as the only family; fix loading (section 6) |
| The workflow chain as hero | `ControlCenter.tsx` | Keep the concept; rebuild the form (section 8) |
| Honesty: no invented proof | "Illustrative" labels, no fake logos or testimonials | Keep and make it a visible virtue (principle 6) |
| Tokens only, never hardcoded colour | `src/styles.css` | Keep and tighten (section 11) |
| Reduced-motion support | `prefers-reduced-motion` block in `styles.css` | Keep |
| The "someone has to…" voice | `Problem.tsx` | Keep; it is the best copy on the page |

---

## 3. What we found in the current UI

An audit of `src/components` on 2026-09-21. Counts are literal grep counts.

| Finding | Evidence | Why it matters |
|---|---|---|
| The brand font never loads | No `@font-face`, no font link, no `@fontsource` package anywhere. `--font-sans` names Plus Jakarta Sans, then falls through to the system font | Every visitor sees Segoe UI or San Francisco. The brand typeface is currently not on the site at all |
| The gradient is everywhere | `text-gradient` used 18 times, `bg-brand-gradient` 5, `brand-glow` 10 | When everything glows, nothing does. The gradient has become decoration and lost its meaning |
| One gradient phrase per headline | Hero, Problem, PatternInterrupt and others all colour the last few words | This is the most common sign of a generated page |
| Tracked-out capital labels | `uppercase` used 22 times, mostly at 10–11px | Hard to read, and a template habit rather than a choice |
| Text below the legibility floor | 14 arbitrary sizes under 13px, down to `text-[0.5rem]` (8px) | Fails the 12px minimum; unreadable on a phone |
| Every block fades and slides up | `<Reveal>` used 32 times | Scattered entrance motion reads as generic and delays content |
| The card kit | `rounded-2xl` 21 times, `rounded-3xl` 7, same border and surface on all | One radius and one container for every kind of content flattens the hierarchy |
| Arrows on buttons | `ArrowRight` 12 times | Template chrome |
| Invented numbers in the hero | KPI tiles "248 new leads", "47 appointments" | Labelled illustrative, but still contradicts the no-fake-metrics promise at the most visible spot |
| Primary button fails contrast | `--primary-foreground` on `--primary` is 4.01:1 | Below WCAG AA 4.5:1 for 14–16px button text |
| Purple text on cards is borderline | `--primary` on `--surface` is 4.47:1 | Just under AA |
| Weak focus indicator | shadcn default `focus-visible:ring-1` in the same purple as the button | Nearly invisible on a primary button |
| Six names for one action | "Book a Free Consultation", "Book a Consultation", "Book My Free Consultation", "Book a Call", "Build This for My Business", "Let's Analyse My Workflow" | The visitor cannot tell whether these are the same thing |
| Two sections say the same thing twice | `LiveWorkflow` repeats the hero demo; `BeforeAfter` repeats `Problem` | 14 sections is long for one decision |
| Leftover metadata | `twitter:site` is `@Lovable` in `__root.tsx` | Wrong brand on shared links |

Passing today and worth protecting: body text 16.1:1, muted text 7.6:1 on background, accent cyan 11.5:1, success 8.6:1.

---

## 4. Principles

Seven rules. When two of them disagree, the lower number wins.

### 1. Show the system running
The hero is not a headline with a picture next to it. It is one real-looking run: a named lead arrives, gets qualified, lands in the CRM, receives a WhatsApp message, and books a slot. The visitor can start it themselves. A thing that works in front of you is more convincing than a sentence saying it works.

### 2. The gradient is current
Purple to cyan means one thing: **automation is flowing here**. It appears on the run line, on the node that is active right now, and on nothing else. It never colours headline words, icons, badges or backgrounds. Budget for the whole landing page: the run, plus one atmospheric glow behind the hero and one behind the final call to action.

### 3. Manual and automated look different
The site argues that manual work is fragmented and automated work is continuous, so the two get different materials.

| State | Line | Colour | Alignment |
|---|---|---|---|
| Manual | Dashed, broken, with gaps where a person has to step in | `--muted-foreground`, no glow | Slightly offset, never on the rail |
| Automated | Solid and continuous | `--gradient-brand` | Locked to the rail |
| Done | Solid | `--success` | Locked to the rail |

This applies to headlines too. A two-part statement sets the manual clause in muted grey and the automated clause in full white, whole lines at a time. `PatternInterrupt` already does this; it becomes the rule.

### 4. Structure tells the truth
Numbers mark real sequences only: the run, the four process steps, the booking steps. A border means "this is one object you can act on". A pill means "this is a status". If a device does not encode something, remove it. No label above a heading unless the heading is unclear without it.

### 5. One orchestrated motion
The run is the page's single piece of choreography. Sections below the hero appear in place, without fade-and-slide. All other motion answers the visitor: a tab opening, a slot being selected, a step confirming.

### 6. Honest by design
No testimonials, logos, metrics or case studies until real ones exist. Example content carries a plain "Example" tag that is a designed component, not a footnote at 10px. Trust comes from showing the process clearly and saying exactly what happens after booking.

### 7. Quiet everywhere else
One family, one accent system, three radii, no grey drop shadows. Before shipping a section, remove one thing from it.

---

## 5. Colour

All existing OKLCH values stay. What changes is the role each one is allowed to play, plus two additions that fix contrast failures.

### Base palette

| Name | Token | Value | Role |
|---|---|---|---|
| Ink | `--background` | `oklch(0.128 0.024 274)` ≈ `#070B14` | Page |
| Panel | `--surface` | `oklch(0.176 0.03 271)` ≈ `#0D1220` | Instruments and dialogs |
| Raised | `--surface-2` | `oklch(0.222 0.038 272)` | Controls inside a panel |
| Paper | `--foreground` | `oklch(0.924 0.011 255)` ≈ `#E2E8F0` | Text, automated clauses |
| Graphite | `--muted-foreground` | `oklch(0.702 0.032 257)` ≈ `#94A3B8` | Secondary text, manual clauses |
| Violet | `--primary` | `oklch(0.606 0.221 295)` ≈ `#8B5CF6` | Start of the run, focus of brand |
| Cyan | `--accent` | `oklch(0.808 0.117 216)` ≈ `#3CCFF5` | End of the run, focus ring, live values |
| Green | `--success` | `oklch(0.716 0.183 148)` ≈ `#22C55E` | Done, booked |

### New tokens

| Token | Value | Reason |
|---|---|---|
| `--primary-fill` | `oklch(0.54 0.221 295)` | Button background. White text on it is 5.31:1 (was 4.01:1). Against the page it is 3.58:1, above the 3:1 needed for a control |
| `--link` | same as `--secondary`, `oklch(0.729 0.16 296)` | Text links and purple text on panels. 7.96:1 on background (violet was 4.47:1 on panels) |
| `--flow` | alias of `--gradient-brand` | Names the gradient by meaning so misuse is obvious in review |
| `--manual` | alias of `--muted-foreground` | Same reason |

### Rules
- Violet as **text** only at 24px and above. Below that use `--link`.
- Never put white text on the cyan end of the gradient (1.66:1). Text on a gradient surface uses `--accent-foreground` dark ink, or the gradient stays a line and carries no text.
- Colour never carries meaning alone. Status always has a word beside it: Running, Done, Waiting.
- No raw `oklch()`, hex, or `shadow-[…]` arbitrary values in components. If a component needs a colour, it needs a token.
- Borders: `--border` for resting objects, `--border-strong` for the object being pointed at. No grey `rgba(0,0,0,.1)` shadows; on a dark page they do nothing. Elevation is a lighter surface, not a shadow.

---

## 6. Typography

One family: **Plus Jakarta Sans**, variable, self-hosted.

Fix first: add `@fontsource-variable/plus-jakarta-sans`, import it once in the root, and preload the Latin woff2. No request to Google at runtime, no layout shift from a late font swap. Set `font-display: swap` with a metric-matched fallback so the hero does not jump.

Personality comes from weight and size contrast, not from a second typeface or from colour. Display is heavy and tight; body is regular and open.

| Role | Size | Line height | Weight | Tracking |
|---|---|---|---|---|
| Display (hero h1) | `clamp(2.5rem, 1rem + 6vw, 4.5rem)` | 1.02 | 800 | −0.035em |
| Statement (section h2) | `clamp(1.875rem, 1rem + 3.5vw, 3.25rem)` | 1.1 | 700 | −0.025em |
| Title (h3, panel heads) | 1.375rem | 1.25 | 700 | −0.015em |
| Lead | 1.125–1.25rem | 1.55 | 400 | 0 |
| Body | 1rem | 1.6 | 400 | 0 |
| Small | 0.875rem | 1.5 | 400–500 | 0 |
| Micro (status, tags) | 0.75rem | 1.4 | 500 | 0.01em |

Rules:
- **0.75rem (12px) is the floor.** Delete every `text-[0.5rem]` through `text-[0.7rem]`.
- Sentence case everywhere, including buttons, tags and nav. No tracked-out capitals.
- Line length 45–70 characters for running text. Headlines break by meaning, with `text-wrap: balance`.
- Numbers that change or line up (times, slots, calculator output) use `font-variant-numeric: tabular-nums`.
- No gradient text. No single coloured word in a headline. Emphasis inside a headline comes from the muted/full contrast between whole lines (principle 3).
- Left aligned. Centre alignment is reserved for the final call to action and the booking confirmation.

---

## 7. Layout

### Concept: the rail
On desktop a thin vertical line runs down a fixed column on the left of the content area. It is the run, continued down the page. Sections hang off it like nodes on a workflow. It is dashed and grey through the sections about manual work, becomes solid gradient at the point where the page starts talking about automation, and turns green at the booking call to action.

```
desktop ≥1024                              mobile
┌──────────────────────────────────────┐   ┌──────────────────┐
│ nav                                  │   │ nav              │
│                                      │   │                  │
│ ●━━ We automate the work     ┌─────┐ │   │ ● We automate    │
│ ┃   you shouldn't be doing   │ the │ │   │ ┃ the work…      │
│ ┃   manually.                │ run │ │   │ ┃ [Book a free…] │
│ ┃   [Book a free consult.]   └─────┘ │   │ ┃ ┌────────────┐ │
│ ┊                                    │   │ ┃ │  the run   │ │
│ ┊   The problem isn't how much       │   │ ┃ └────────────┘ │
│ ┊   you work. (statement, no box)    │   │ ┊                │
│ ┊                                    │   │ ┊ statement      │
│ ◌┄┄ a lead fills out a form          │   │ ◌ broken chain   │
│ ◌┄┄ someone has to check it          │   │ ◌                │
│ ┃                                    │   │ ┃                │
│ ●━━ What we automate  ┌────────────┐ │   │ ● instrument     │
│ ┃                     │ instrument │ │   │ ┃                │
│ ✓━━ Book              └────────────┘ │   │ ✓ Book           │
└──────────────────────────────────────┘   └──────────────────┘
  ┊ dashed grey = manual   ┃ gradient = automated   ✓ green = done
```

The rail is decoration for sighted users and is hidden from assistive technology. On mobile it sits in the 20px gutter; if it crowds content below 360px it is dropped, never the content.

### Two kinds of section
- **Statement**: type on the page background. No container, no border, no card. Used for the pattern interrupt, the problem, the benefits.
- **Instrument**: one panel that does something — the run, the category explorer, the calculator, the booking calendar. One instrument per section at most.

Cards are for things you can act on. A paragraph does not become a card just to fill a grid.

### Grid and spacing
- Content width 72rem (`max-w-6xl`); running text capped at 40rem.
- 4px base, scale 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128.
- Section rhythm: 96px mobile, 128px desktop between sections; 24–32px inside a panel.
- Breakpoints as Tailwind defaults; design at 375, 768, 1024, 1440. No horizontal scroll at any width.

### Shape
Three radii, chosen by what the object is, replacing one radius on everything:

| Object | Radius |
|---|---|
| Instrument panels, dialogs | 20px |
| Controls: buttons, inputs, list rows | 10px |
| Status pills, avatars | full |

### Proposed section map (14 → 10)

| New | Built from | Kind |
|---|---|---|
| Hero with the run | `Hero`, `ControlCenter`, `LiveWorkflow` | Instrument |
| The problem isn't how much you work | `PatternInterrupt` | Statement |
| The broken chain | `Problem` + `BeforeAfter` | Statement |
| What we automate | `WhatWeAutomate` + `Benefits` | Instrument |
| Works with your tools | `Integrations` | Statement |
| Example workflows by industry | `UseCases` | Instrument |
| What manual work costs you | `Calculator` | Instrument |
| How it works, and what the call covers | `Process` + `Trust` | Statement, numbered — a real sequence |
| Questions | `Faq` | Statement |
| Book | `FinalCta` | Centre-aligned close |

This is an information-architecture recommendation. Section order and copy decisions stay with the business.

---

## 8. Signature element: the run

The hero instrument replaces the current dashboard card.

- **Content is a story, not a dashboard.** Each node shows what actually happened, in plain words: "Sara filled in the contact form", "Qualified — budget and timeline fit", "Added to the CRM", "WhatsApp sent: 'Hi Sara, thanks for…'", "Booked Thursday 14:00". Remove the four KPI tiles; invented totals do not belong here (principle 6).
- **The visitor can start it.** A "Send a test lead" control triggers the run. It also plays once on first view. Motion that answers an action is the strongest kind.
- **It plays once, then rests** on the completed state with a "Run it again" control. No endless loop; it pauses when off screen.
- **Reduced motion:** render the completed run immediately, no animation. This already works in `ControlCenter.tsx`; keep that behaviour.
- **Accessible:** an ordered list with real text. Status changes announced through a polite live region, once per run, not once per tick.
- **Tagged "Example"** with the designed tag from principle 6, at 12px or larger.

The same line is the progress indicator in the booking flow, so booking feels like the last node of the run the visitor just watched.

---

## 9. Motion

| Token | Duration | Use |
|---|---|---|
| `--motion-micro` | 150ms | Hover, press, focus |
| `--motion-state` | 250ms | Tabs, accordions, step changes, dialogs |
| `--motion-run` | 450ms per node | The run only |

- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` to enter (already in `styles.css`); exits are 30% shorter and ease-in.
- Animate `transform` and `opacity` only. Never width, height, or top/left.
- Remove `Reveal` from section content: 32 uses today, target zero below the hero. Content is present when the visitor arrives.
- Remove `hover:-translate-y` card lifts. Hover changes border strength; that is enough.
- One infinite animation allowed: the small "live" dot, and only while its instrument is on screen.
- Every interaction gives feedback within 100ms. Async actions (slot loading, booking submit) show a pending state on the control that was pressed.
- `prefers-reduced-motion`: final states, no movement. Keep the existing global block.

---

## 10. Voice and copy

Plain, specific, second person. Describe what happens; do not sell.

- **One name per action.** The primary action is **"Book a free consultation"** everywhere: navbar, hero, sticky bar, final section. The dialog title matches. The confirmation says "You're booked." Secondary in-page links say where they go: "See how it works".
- Sentence case. No arrows inside buttons. No exclamation marks.
- Keep the "someone has to…" construction; it names the pain without jargon.
- Name things the way the customer does: "follow-ups", "replies", "bookings" — not "pipelines", "orchestration", "agents".
- Errors say what happened and what to do, without apology: "That slot was just taken. Pick another time." Empty states invite an action: "No consultations yet. Share your booking link."
- Tag example content with the single word "Example". Drop long disclaimers in tiny type.
- Fix shared-link metadata: remove `twitter:site: @Lovable`, add a real Open Graph image.

---

## 11. Quality floor

Not announced on the page, never skipped.

**Accessibility (WCAG 2.1 AA)**
- Text contrast 4.5:1, large text and controls 3:1. Use the fixed tokens in section 5.
- Focus: 2px `--accent` cyan ring with 2px offset on every interactive element, replacing shadcn's `ring-1`. Cyan is 11.5:1 on the page and stays visible on a violet button.
- Targets at least 44×44px with 8px between them. The sticky mobile bar respects the safe-area inset.
- One `h1`, headings in order, landmarks for nav, main and footer. Decorative glows, the rail and icons are `aria-hidden`.
- Forms: visible labels, never placeholder-only. Errors beside the field and summarised at the top for multi-field steps. Focus moves to the first error.
- The booking dialog traps focus, closes on Escape, and returns focus to the control that opened it.

**Performance**
- Self-hosted variable font, preloaded, Latin subset.
- At most two blurred glows per page; `filter: blur(90px)` on ten elements is expensive on phones.
- Reserve space for the run so nothing shifts when it starts (CLS under 0.1).
- Icons from `lucide-react` only. No emoji as icons.

**Implementation rules**
- Tokens live in `src/styles.css`. Components use semantic classes (`bg-surface`, `text-muted-foreground`). No arbitrary colour, shadow or sub-12px size values.
- Restyle shadcn primitives in `src/components/ui` once (button, input, dialog, tabs, accordion) rather than overriding with `className` at every call site.
- Shared patterns become components: `Statement`, `Instrument`, `Rail`, `RunNode`, `StatusPill`, `ExampleTag`.
- The repo syncs with Lovable. Small, working commits on `main`; never rewrite pushed history (see `AGENTS.md`).
- CI must stay green: run `bun run lint` before pushing.

---

## 12. Booking flow and admin

**Booking** is the end of the run and stays in the same visual world. One question per step, the rail as progress, the primary button always in the same place and always named for what it does ("Continue", then "Book this time"). The calendar is an instrument panel. The confirmation is the one fully centred, fully green moment on the site.

**Admin** uses the same tokens at higher density: 14px base, 8–32px spacing, tables instead of cards, no glow, no gradient, no run. It is a tool for the owner, not marketing.

---

## 13. What we rejected, and why

Checked against the looks that AI-built pages fall into by default.

| Default | Decision |
|---|---|
| Near-black page with one bright accent | The brand board fixes the dark violet-to-cyan palette, so it stays. What makes it ours is that the accent now has a meaning instead of being sprinkled |
| Identical rounded cards with soft shadows | Rejected. Statements lose their boxes; three radii by object type; no grey shadows |
| Big number, small label, gradient accent in the hero | Rejected. KPI tiles removed; the hero is a story you can trigger |
| Capital eyebrow labels, middle-dot meta strings, arrows on buttons | Rejected throughout |
| Monospace for small data labels | Rejected. One family; tabular figures do the aligning |
| One gradient word per headline | Rejected. Whole-line muted/full contrast instead |
| Fade-and-slide on every section | Rejected. One choreographed run |
| A second display typeface for "personality" | Rejected. The brand family is kept and actually loaded; weight contrast carries it |
| Light lavender theme with Inter (suggested by the design database) | Rejected. It conflicts with the brand board |

---

## 14. Rollout order

Each step ships on its own and leaves the site working.

1. **Foundations** — load the font; add `--primary-fill`, `--link`, `--flow`, `--manual`, motion tokens; fix focus ring and button contrast; remove sub-12px text. Visible improvement, no layout change.
2. **De-noise** — remove gradient text, capital labels, button arrows, card hover lifts and `Reveal` below the hero. Unify the call-to-action label.
3. **The run** — rebuild the hero instrument; retire `LiveWorkflow`.
4. **The rail and section kinds** — introduce `Rail`, `Statement`, `Instrument`; merge sections per the map in section 7.
5. **Booking and admin** — rail progress, confirmation moment, denser admin.
6. **Review** — accessibility audit, screenshots at 375, 768, 1024 and 1440, reduced-motion pass, Lighthouse.

---

## 15. Review checklist

Ask these of any new section or pull request.

- [ ] Does the gradient appear only where automation is flowing?
- [ ] Is every number marking a real sequence?
- [ ] Is any text under 12px, in tracked capitals, or gradient-filled?
- [ ] Is this a statement or an instrument? If it is a card, can the visitor act on it?
- [ ] Does any motion play without the visitor asking, other than the run?
- [ ] Is the primary action called "Book a free consultation"?
- [ ] Is every figure or example either real or tagged "Example"?
- [ ] Contrast 4.5:1, visible cyan focus ring, 44px targets, works with reduced motion?
- [ ] Only tokens — no raw colour, shadow or size values in the component?
- [ ] What one thing can be removed?

---

## How this document was produced

- Audit of the live codebase (`src/styles.css`, all section and site components, `.lovable/plan`), with contrast ratios computed from the OKLCH tokens.
- `frontend-design` skill: plan, check against generic defaults, revise; typography and copy guidance; restraint.
- `ui-ux-pro-max` skill: design-system query (pattern match: *Product demo + features*, which supports an interactive hero with a static fallback and reduced-motion handling), typography, style and UX priority rules (accessibility, touch, performance, motion). Its colour and font suggestion — a light lavender theme in Inter — was not adopted because it contradicts the brand board. Nothing from it was persisted to `design-system/`.
