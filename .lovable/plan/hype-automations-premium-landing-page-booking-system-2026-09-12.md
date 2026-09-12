# Hype Automations — Premium Landing Page + Booking System

A single high-converting landing page in English, styled on the Hype Automations brand board (near-black background, purple → cyan gradient, Plus Jakarta Sans), plus a real consultation booking system with saved bookings and an admin area.

## Brand foundation

- Dark palette: background #070B14, surface #0D1220, primary #8B5CF6, accent #3CCFF5, secondary #A78BFA, text #E2E8F0 / #94A3B8, success #22C55E
- Plus Jakarta Sans (Bold display, SemiBold headlines, Regular body)
- Purple→cyan gradient accents, atmospheric glows, glass cards, thin luminous borders
- All colors set as design tokens so nothing is hardcoded per component

## Page sections (in scroll order)

1. Navbar — transparent, turning to dark glass on scroll. Solutions, Automations, How It Works, Integrations, FAQ + "Book a Consultation"
2. Hero — "We automate the work you shouldn't be doing manually.", gradient highlight, both CTAs, trust microline, and an animated Control Center visual: New Lead → AI Qualification → CRM → WhatsApp → Follow-up → Booking with pulses travelling between nodes, live notification cards, and KPI tiles marked as illustrative
3. Pattern interrupt — oversized typography, second line revealed on scroll
4. The problem — six interactive numbered cards + closing statement + "Show Me What's Possible"
5. Before / After — fragmented manual chain vs. luminous automated chain
6. What we automate — eight categories; hover reveals a mini workflow on desktop, tap expands on mobile
7. Live automation demo — six-step sequence animating to "MEETING BOOKED ✓" + "Build This for My Business"
8. Integrations — WhatsApp, Google Calendar, Gmail, Sheets, Notion, HubSpot, Stripe, Shopify, Meta, Webflow, + more (no partnership claims)
9. Benefits — Time, Speed, Control, Scale with visual treatments
10. Use cases — tabs for five industries, labelled as example workflows
11. Cost of manual work — 3-input calculator with live estimate, "Illustrative estimate" label, "Let's Analyse My Workflow"
12. How it works — Discover / Map / Build / Optimise + journey chain
13. The consultation — what we'll discuss, what happens next, primary CTA
14. FAQ — six-item accordion
15. Final conversion — full-width glow climax with background automation network
16. Footer — Hype Automations by Hype Digital Consulting, links, no invented legal data
17. Mobile sticky bar — "Ready to automate?" + "Book a Call", appears after hero, hides inside booking

## Booking experience (built-in, with database)

Full-screen premium modal/route staying inside the Hype visual world:

1. Business type (single choice)
2. What to automate (multi-select)
3. Where enquiries come from
4. Tools used (multi-select + free text)
5. Time selection from a real calendar of available slots, timezone shown
6. Contact details: name, company, business email, phone/WhatsApp, website (optional), notes, privacy consent
7. Confirmation: "You're booked." with date/time/timezone, Add to Calendar (.ics), reschedule link, and what-happens-next steps

Availability rules honoured: working days and hours, meeting duration, buffer, blocked dates, max bookings per day, minimum notice, timezone. Double booking prevented server-side.

Admin area (sign-in protected) to view upcoming consultations with their answers, and to manage availability and blocked dates.

## Technical notes

- Cloud backend enabled for storage: tables for `bookings`, `availability_rules`, `blocked_dates`, plus `user_roles` + `has_role()` for admin access. RLS on all tables with explicit grants; public visitors can create a booking and read only free/busy slot info, never other people's data
- Booking creation and slot computation run in server functions; slot conflicts checked in a transaction-safe way against a unique constraint
- Admin routes live under the authenticated layout; the landing page stays fully public and server-rendered
- Motion for React for scroll reveals and node pulses; all animation respects prefers-reduced-motion; no parallax, scroll hijacking or heavy video
- Mobile-first layouts, large touch targets, no horizontal overflow
- SEO: unique title/description/OG/Twitter tags, single H1, semantic sections, alt text
- Architecture kept swappable so a Calendly embed or Google Calendar sync can replace the native calendar step later without redesigning the page

## Not included (no invented data)

No fake testimonials, client logos, case studies or metrics. Trust comes from clarity, process transparency and labelled example workflows. Footer legal details and any real proof can be added once you provide them.
