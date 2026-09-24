<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The public website for **Bawari Group**, a Berlin/Hamburg-based importer and distributor of premium Pakistani basmati rice for the German market (diaspora, mainstream retail, food service/HORECA, private label) — plus an internal admin panel/CRM at `/admin` for managing B2B/B2C leads (see the **Admin Panel / CRM** section below). The public site is a **marketing/trade site only** — no cart, checkout, or payments. See `PROJECT.md` for the full business/brand brief and open questions. Brand source material (guidelines PDF, business profile, logos) lives in `brand-assets/` — treat the Strategic Business Profile's "TO COMPLETE" items (leadership roles, addresses, named suppliers) as unconfirmed and keep them off the public site.

## Commands

```bash
npm install       # install dependencies
npm run dev        # start dev server (Turbopack) at http://localhost:3000
npm run build       # production build (also prerenders all locale pages)
npm run start       # run the production build
npm run lint         # eslint
```

There is no test suite configured yet.

## Architecture

Stack: Next.js (App Router) + TypeScript + Tailwind CSS + [next-intl](https://next-intl.dev) for i18n.

**Locale routing.** Every public route lives under `src/app/[locale]/` (the `/admin` tree is deliberately outside this — see below). `src/proxy.ts` (Next.js's middleware convention, renamed from `middleware.ts`) is the **one** proxy/middleware file the app is allowed to have, so it does double duty: for `/admin/**` paths it checks the Supabase session and redirects to `/admin/login` if absent; for everything else it falls through to `next-intl`'s `createMiddleware` to detect/redirect locales. Supported locales and the default locale are defined in one place: `src/i18n/routing.ts` (currently `en`, `de`; default `en`). Adding a locale means adding it there and creating a matching `messages/<locale>.json`.

**Translations.** Copy lives in `messages/en.json` / `messages/de.json`, namespaced by page/section (`Metadata`, `Nav`, `Footer`, `Home`, `Products`, `Quality`, `About`, `Contact`, `LocaleSwitcher`). `src/i18n/request.ts` loads the right file per request based on the resolved locale.

**IMPORTANT — server vs. client translation hooks, the main gotcha.** Page components under `src/app/[locale]/**/page.tsx` are `async` Server Components and must use `await getTranslations(...)` from `next-intl/server`. Calling the synchronous `useTranslations` (from `next-intl`) inside an async component throws at build/prerender time. Non-async server components (`Header`, `Footer`) and Client Components (`ContactForm`, `LocaleSwitcher`, both `"use client"`) use `useTranslations` directly instead.

**TypeScript & imports.** Strict mode is on (`tsconfig.json`). Import via the `@/*` path alias (maps to `src/*`) rather than relative `../../` chains.

**Server vs. Client Components.** Everything is a Server Component by default; only `ContactForm.tsx` and `LocaleSwitcher.tsx` are `"use client"` (they need form/browser state). Don't add `"use client"` to a component unless it actually needs interactivity.

**Static generation.** Every public page and the locale layout export `generateStaticParams` returning `routing.locales`, so all locale variants prerender as static HTML (`npm run build` output shows `● /en/...`, `● /de/...`). Locale resolution itself happens in `src/i18n/request.ts` via `next/root-params` (next-intl's older `setRequestLocale`/`requestLocale`-callback pattern is deprecated as of next-intl 4.14 in favor of this — don't reintroduce it). The `/admin/**` routes are intentionally dynamic (`ƒ` in the build output), not static, since they read cookies/the database per request.

**Navigation.** Use `Link`, `useRouter`, `usePathname` from `src/i18n/navigation.ts` (wraps next-intl's `createNavigation`) instead of `next/link` / `next/navigation`, so the current locale prefix is preserved automatically. `LocaleSwitcher.tsx` shows the pattern for changing locale while staying on the same route.

**Config.** `next.config.ts` wraps `nextConfig` with next-intl's plugin pointed at `src/i18n/request.ts`, and pins `turbopack.root` to the project directory (there's an unrelated `package-lock.json` in the parent home directory that otherwise confuses Turbopack's workspace-root inference).

**IMPORTANT — don't relocate this file or `CLAUDE.md`.** `next dev` unconditionally (re)writes `AGENTS.md`/`CLAUDE.md` at the project root on startup whenever they're missing there (logs `✓ Generated AGENTS.md and CLAUDE.md for AI agents`), overwriting them with a generic stub that strips everything below the `nextjs-agent-rules` banner. Moving these into `.claude/` (or anywhere else) causes `next dev` to silently regenerate stripped duplicates at root on the next run. To make `.claude/` the real home instead, set `agentRules: false` in `next.config.ts` first — otherwise leave both files at the root.

**`.claude/` directory.** `settings.json` / `settings.local.json` (empty permission lists) and `agents/` / `skills/` (empty, README placeholders) are scaffolding only. `rules/code-style.md` and `rules/frontend/react.md` (the latter scoped via `paths:` frontmatter to `src/**/*.ts(x)`) *do* auto-load per Claude Code's own convention — no `@import` needed. `.mcp.json` and `CLAUDE.local.md` live at the project root, not in `.claude/` — that's the correct location per Claude Code's docs (`.claude/CLAUDE.local.md` is not a recognized auto-load path).

**Project memory.** Claude Code's auto memory (distinct from this file — it's notes Claude writes about you/this project across sessions, not instructions you write) lives outside the repo at `~/.claude/projects/<repo-path-key>/memory/`, keyed off the git repository's location. Since this repo's `.git` moved into `Bawari_group/` (see git history around 2026-09-14), any session launched from the old `Claude_myProjects/` root would resolve to a different, empty memory folder than one launched from here — always launch Claude Code with this directory (or a subdirectory of it) as the working directory.

**Contact form.** `src/components/ContactForm.tsx` (`"use client"`) submits to `POST /api/contact`, which inserts a `leads` row (`source: "contact_form"`, no segment set — the admin triages it later from the lead's detail page). There's no separate email delivery; the CRM *is* where submissions go now.

## Admin Panel / CRM

A separate internal tool at `src/app/admin/**` — English-only, deliberately outside the `[locale]`/next-intl tree (its own `layout.tsx` renders `<html>/<body>` independently; no `NextIntlClientProvider`, no `messages/*.json`, just hardcoded strings). It reuses the public site's brand Tailwind tokens/fonts for visual consistency only.

- **Auth:** Supabase Auth (email/password), one admin account for now. `src/lib/supabase/{client,server,middleware}.ts` are the three client factories (browser, Server Component, and `proxy.ts`'s middleware context respectively — don't mix them up). There's no signup UI or seed script; the admin user is created/reset via the Supabase dashboard (Authentication → Users).
- **Database:** Supabase Postgres (`eu-central-1`/Frankfurt), queried via **Drizzle ORM** (`src/lib/db/schema.ts` + `index.ts`), not Supabase's own Data API/PostgREST — "Automatically expose new tables" was deliberately left off when the project was created, so the `leads`/`icps`/`lead_activities` tables aren't reachable via the anon key at all, by design (no RLS policies exist or are needed, since only server-side Drizzle code ever touches them).
  - **`drizzle-kit push` is broken against this database** — its introspection crashes (`Cannot read properties of undefined (reading 'replace')`) on Supabase's own `auth`/`storage`/`realtime` schema constraints, even with `schemaFilter: ["public"]` set. Apply schema changes with a one-off raw-SQL script (see `PROJECT.md`) instead of relying on `push`.
- **Data model:** `icps` (Ideal Customer Profiles — saved Apollo search criteria, segment restricted to the 2 B2B segments), `leads` (segment nullable — contact-form leads land unclassified for manual triage), `lead_activities` (notes/status-change log).
- **Apollo.io integration** (`src/lib/apollo.ts`): `searchOrganizations()` hits Apollo's B2B company-search API for the ICP "Find Leads" button; only company/contact data exists there (no individual-consumer data), which is why ICPs are hard-restricted to B2B segments in the UI, not just documented. Set `APOLLO_MOCK=true` locally to use a canned fixture instead of spending real Apollo credits/hitting plan limits while developing.
- **Env vars:** see `.env.example` — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `DATABASE_URL` (Supabase's pooled/Supavisor connection string, not the direct one), `APOLLO_API_KEY`, `APOLLO_MOCK`.

**Design mockups become coded components, not embedded images.** Client-provided marketing mockups (SVGs in `brand-assets/images/`) are reproduced as coded sections rather than embedded directly as `<img>`/`next/image` — e.g. `src/components/ProductJarIcon.tsx` and `ServiceIcon.tsx` on `/products` recreate the mockup's jar/icon illustrations in JSX using colors and layout values read out of the mockup's own SVG markup (`fill=`/`rect`/`text` attributes), so the copy stays per-locale translatable and crawlable instead of baked into a raster/vector image. This does not apply to pure diagrams/infographics (import process flow, QA programme, supply chain map, retail network) — those are legitimately images (not translatable text-bearing UI) and are rasterized to `public/brand/*.png`, rendered via `next/image`, and captioned as English-only reference diagrams.

**Brand.** Colors (`brand-charcoal`, `brand-gold`, `brand-gold-dark`, `brand-cream`, `brand-neutral`, etc.) are defined as CSS variables in `src/app/globals.css` and exposed as Tailwind utilities via `@theme inline` — use these tokens rather than raw gray/black Tailwind classes. Headings use `font-serif` (EB Garamond); body text uses the default `font-sans` (Montserrat), both loaded in `src/app/[locale]/layout.tsx`. The crest logo lives at `public/brand/bawari-crest.png`; `src/app/icon.png` and `src/app/apple-icon.png` are square crops generated from it (Next.js App Router auto-detects these as favicon/app-icon — no `favicon.ico`).
