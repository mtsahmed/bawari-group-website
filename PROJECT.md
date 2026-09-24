# Bawari Group Web App

## Overview
The public website for **Bawari Group**, a Berlin- and Hamburg-based importer and distributor of premium Pakistani basmati rice, built to serve Germany's South Asian, Afghan/Central Asian, Middle Eastern/Turkish, and mainstream specialty-food consumer base, plus food-service (HORECA) and retail/private-label partners.

This is currently a **marketing/trade site** — product portfolio, quality & compliance story, company background, and a contact/inquiry form. **No cart, checkout, or payments yet** (see Open Questions — a future DTC webshop was mentioned as an "immediate-term channel" in the business profile but is out of scope for this build).

> Note: the project briefly started as a generic "ecommerce services agency" placeholder based on an early, brief description. Once the client's real Brand Guidelines and Strategic Business Profile were provided, the site was rebuilt around the actual business described below.

## The Business
- **What:** Import and distribution of premium Pakistani basmati rice (Super Basmati, Kernel Basmati, Sella/parboiled, Steam, Brown, plus long-grain non-basmati) in retail, food-service, and private-label formats.
- **Where:** Two-city operating model — **Berlin** (commercial HQ) and **Hamburg** (logistics/import, via the Port of Hamburg).
- **Who it serves:** South Asian/Pakistani diaspora, Afghan & Central Asian diaspora, Middle Eastern & Turkish communities, mainstream German consumers, food service/HORECA, and private-label/B2B retail partners.
- **Positioning:** "A heritage crest for a modern trading house" — premium provenance and compliance rigour, not a generic bulk commodity importer.
- **Compliance:** Rice from Pakistan is subject to strict EU border controls (pesticide/mycotoxin testing, TRACES NT pre-notification, etc.). Bawari Group's QA programme (supplier qualification → pre-shipment testing → documentation → border entry → storage → recall readiness) is a core trust signal for both consumers and trade buyers.

Source material: `brand-assets/documents/Bawari Group - Strategic Business Profile.pdf` (confidential/internal — used to inform public copy, with unconfirmed "TO COMPLETE" details such as leadership roles, addresses, and named supplier relationships deliberately left out of the public site).

## Brand
- **Guidelines:** `brand-assets/documents/Bawari Group - Brand Guidelines.pdf` (canonical reference).
- **Logo:** heritage crest — shield, gold "B" monogram, wheat-stalk wreath. Master files in `brand-assets/logos/` (transparent, white, soft-neutral, premium-dark variants) and `public/brand/bawari-crest.png` (the transparent version used on-site).
- **Colors:** Charcoal Ink `#232B2C`, Charcoal Slate `#343B3C`, Heritage Gold `#C99A50`, Antique Gold `#A4793B`, Parchment Cream `#FFFFEF`, Soft Neutral `#F3F2EE` — defined as CSS variables/Tailwind tokens in `src/app/globals.css` (`brand-charcoal`, `brand-gold`, etc.).
- **Typography:** EB Garamond (headings/display) + Montserrat (body/UI), loaded via `next/font/google` in `src/app/[locale]/layout.tsx`.

## Tech Stack
- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS with the Bawari Group brand palette
- **i18n:** next-intl (locale-based routing: `/en`, `/de`) — public marketing site only, not the admin panel
- **Database + Auth:** Supabase (Postgres, EU/Frankfurt region; Supabase Auth for the single admin login), queried via Drizzle ORM
- **Lead sourcing:** Apollo.io API (B2B company/contact data only — see Admin Panel section)
- **Deployment target:** Vercel

## Site Structure
- `/` — Home (positioning, two-city model, who we serve, quality teaser, CTA)
- `/products` — Rice portfolio, packaging & formats, services
- `/quality` — Sourcing + QA/compliance programme
- `/about` — Brand story, two-city model, founding partners (names only — roles/bios unconfirmed), mission
- `/contact` — Inquiry form (general/trade) — submissions now land in the CRM (see below) as `contact_form`-sourced leads
- `/admin/*` — Internal admin panel/CRM (English-only, outside the `[locale]` i18n tree, session-gated). Not linked from the public site.

## Admin Panel / CRM
A separate internal tool (`src/app/admin/**`) for the client to manage B2B/B2C customer relationships:
- **Leads** — manually added, sourced via Apollo, or submitted through the public contact form; each has a segment (one of the 6 customer segments above), status (new/contacted/qualified/won/lost), and a notes/activity log. Contact-form leads land with no segment set — the admin assigns one on the lead's detail page during triage.
- **ICPs (Ideal Customer Profiles)** — saved search criteria (keywords, location, employee-count range) restricted to the two B2B segments (Food Service & HORECA; Private Label & B2B Retail), since Apollo has no individual-consumer data. Each ICP has a "Find Leads" button that queries Apollo and inserts new candidate leads for manual review — nothing is auto-contacted.
- Single admin account (email/password via Supabase Auth); more accounts/roles can be added later without a redesign.
- **Forgot password** — the login page has a "Forgot password?" link that calls `resetPasswordForEmail()`, emailing a link to `/admin/auth/confirm` which verifies the token and redirects to `/admin/reset-password` to set a new password. This requires two one-time settings in the Supabase dashboard (project `qijwexrvtcshxjwrhdny`), not in this repo:
  1. **Auth → URL Configuration** — add `https://bawari-group-website.vercel.app/admin/auth/confirm` to the Redirect URLs allowlist (and confirm Site URL is `https://bawari-group-website.vercel.app`).
  2. **Auth → Email Templates → Reset Password** — replace the default body's link (which uses `{{ .ConfirmationURL }}`, routing through Supabase's own `/auth/v1/verify`) with one pointing at our own confirm route: `{{ .SiteURL }}/admin/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/admin/reset-password`.

> **Known issue:** `drizzle-kit push` crashes (`Cannot read properties of undefined (reading 'replace')`) against this Supabase database — its introspection chokes on CHECK constraint formats in Supabase's own `auth`/`storage`/`realtime` schemas, even with `schemaFilter: ["public"]` set in `drizzle.config.ts`. Until upgrading drizzle-kit fixes this, apply schema changes by writing and running the equivalent raw SQL directly (e.g. via a one-off `postgres` client script) instead of `drizzle-kit push`.

## Internationalization
- Locale-prefixed routing (`/[locale]/...`)
- Default locale: English (`en`); second locale: German (`de`) — matches the target market (Germany)
- Additional locales to be added as needed
- All user-facing copy lives in locale message files (`messages/en.json`, `messages/de.json`), not hardcoded in components

## Status
- [x] Project scaffolded (Next.js + TypeScript + Tailwind + i18n)
- [x] Locales decided (English + German)
- [x] Brand assets received and applied (logo, colors, fonts)
- [x] Site rebuilt around the real business (rice import/distribution)
- [x] Infographics incorporated: Import Process Flow + QA Programme (`/quality`), Retail Network (`/`) — images captioned as English-only reference diagrams since the site itself is bilingual
- [x] Products page copy upgraded with variety badges, sourced from the client's own Products & Services Webpage design mockup (`brand-assets/images/Bawari Group - Products & Services Webpage.svg`)
- [x] Contact form backend — submissions insert into the CRM's `leads` table (`source: "contact_form"`), no separate email delivery
- [x] Admin panel / CRM (leads + ICPs), backed by Supabase (Postgres in `eu-central-1` + Auth)
- [x] Apollo.io integration for B2B lead sourcing ("Find Leads" per ICP)
- [ ] Apollo API key — client needs to sign up for a plan with API access; `APOLLO_MOCK=true` used for dev/testing until then
- [ ] Deployment (Vercel project not yet created; env vars need setting there)
- [ ] Not used — explicitly excluded per client direction: `Bawari Group Logo - Option 2 (Heritage Crest).png` (superseded logo option, reference only)
- [ ] Not yet used: `brand-assets/documents/Bawari Supplier Control Process webpage/` — a separate Claude Design canvas artifact (interactive `.dc.html` + `support.js`, not a static image) covering supplier-control/due-diligence content that overlaps with the QA Programme infographic already in use. Skipped for now rather than attempting a complex extraction; flag if this should be pulled in too.
- [ ] Founding partner roles/bios (currently names only, per client direction)
- [ ] Online store / DTC webshop (explicitly out of scope for now)

## Open Questions
- When (if ever) should a real webshop (cart/checkout/payments) be added, and does that go on this site or a separate storefront?
- Should the Supplier Control Process canvas content be incorporated too, and if so, does the client have a static export (image/PDF) of it, since the current file is an interactive design-canvas artifact?
- Registered addresses, VAT/EORI numbers, and other "TO COMPLETE" items from the Strategic Profile — needed before any content citing them goes live (none currently does).
- Should contact-form submissions also trigger an email notification to the client (in addition to landing in the CRM), so new inquiries aren't only visible by checking `/admin/leads`?
- Multiple admin accounts / roles (sales vs. ops) — not needed yet, but the schema supports adding them later.
