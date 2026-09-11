# EcommerceServices Web App

## Overview
A multi-language marketing/services website for an agency that provides ecommerce products and services to international clients. The site showcases the services offered, builds credibility with case studies/portfolio content, and converts visitors into leads via contact/inquiry forms.

This is **not** an online store — no product catalog, cart, or checkout. It is a services/agency website targeting ecommerce businesses as clients.

## Target Audience
International ecommerce businesses (store owners, brand managers, marketing leads) looking for services such as:
- Ecommerce store setup / migration
- Platform development & customization (Shopify, WooCommerce, custom stacks)
- Digital marketing & growth for online stores
- UX/CRO (conversion rate optimization)
- Ongoing support & maintenance

*(Refine this list once the actual service offerings are finalized.)*

## Goals
- Present the agency's ecommerce services clearly to an international audience
- Support multiple languages so content resonates with clients in different regions
- Generate qualified leads through contact/consultation forms
- Build trust via case studies, testimonials, and clear service breakdowns

## Tech Stack
- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **i18n:** next-intl (locale-based routing, e.g. `/en`, `/es`, `/fr`)
- **Deployment target:** Vercel (TBD — confirm with user)

## Site Structure (initial)
- `/` — Home (value proposition, service highlights, CTA)
- `/services` — Services overview + individual service detail pages
- `/case-studies` — Client work / portfolio
- `/about` — Agency background, team, mission
- `/contact` — Lead capture form, contact details

## Internationalization
- Locale-prefixed routing (`/[locale]/...`)
- Default locale: English (`en`)
- Additional locales to be added as needed (structure supports adding more without rearchitecting)
- All user-facing copy lives in locale message files, not hardcoded in components

## Status
- [x] Project scaffolded (Next.js + TypeScript + Tailwind + i18n)
- [ ] Service offerings finalized with client
- [ ] Branding / design direction
- [ ] Content for all pages
- [ ] Contact form backend (email delivery / CRM integration)
- [ ] Additional locales beyond English
- [ ] Deployment

## Open Questions
- Which languages besides English are required, and in what priority?
- Final list of services to feature?
- Any existing brand guidelines (logo, colors, fonts)?
- Where will the contact form submissions go (email, CRM, Slack)?
