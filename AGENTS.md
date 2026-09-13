<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The public website for **Bawari Group**, a Berlin/Hamburg-based importer and distributor of premium Pakistani basmati rice for the German market (diaspora, mainstream retail, food service/HORECA, private label). It is currently a **marketing/trade site only** — no cart, checkout, or payments. See `PROJECT.md` for the full business/brand brief and open questions. Brand source material (guidelines PDF, business profile, logos) lives in `brand-assets/` — treat the Strategic Business Profile's "TO COMPLETE" items (leadership roles, addresses, named suppliers) as unconfirmed and keep them off the public site.

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

**Locale routing.** Every route lives under `src/app/[locale]/`. `src/proxy.ts` (Next.js's middleware convention, renamed from `middleware.ts`) runs `next-intl`'s `createMiddleware` to detect/redirect locales. Supported locales and the default locale are defined in one place: `src/i18n/routing.ts` (currently `en`, `de`; default `en`). Adding a locale means adding it there and creating a matching `messages/<locale>.json`.

**Translations.** Copy lives in `messages/en.json` / `messages/de.json`, namespaced by page/section (`Metadata`, `Nav`, `Footer`, `Home`, `Products`, `Quality`, `About`, `Contact`, `LocaleSwitcher`). `src/i18n/request.ts` loads the right file per request based on the resolved locale.

**Server vs. client translation hooks — this is the main gotcha.** Page components under `src/app/[locale]/**/page.tsx` are `async` Server Components and must use `await getTranslations(...)` from `next-intl/server`. Calling the synchronous `useTranslations` (from `next-intl`) inside an async component throws at build/prerender time. Non-async server components (`Header`, `Footer`) and Client Components (`ContactForm`, `LocaleSwitcher`, both `"use client"`) use `useTranslations` directly instead.

**Static generation.** Every page and the locale layout export `generateStaticParams` returning `routing.locales`, and call `setRequestLocale(locale)` before rendering, so all locale variants prerender as static HTML (`npm run build` output shows `● /en/...`, `● /de/...`).

**Navigation.** Use `Link`, `useRouter`, `usePathname` from `src/i18n/navigation.ts` (wraps next-intl's `createNavigation`) instead of `next/link` / `next/navigation`, so the current locale prefix is preserved automatically. `LocaleSwitcher.tsx` shows the pattern for changing locale while staying on the same route.

**Config.** `next.config.ts` wraps `nextConfig` with next-intl's plugin pointed at `src/i18n/request.ts`, and pins `turbopack.root` to the project directory (there's an unrelated `package-lock.json` in the parent home directory that otherwise confuses Turbopack's workspace-root inference).

**Contact form.** `src/components/ContactForm.tsx` is client-side only and not wired to any backend/email/CRM yet — see the open questions in `PROJECT.md`.

**Brand.** Colors (`brand-charcoal`, `brand-gold`, `brand-gold-dark`, `brand-cream`, `brand-neutral`, etc.) are defined as CSS variables in `src/app/globals.css` and exposed as Tailwind utilities via `@theme inline` — use these tokens rather than raw gray/black Tailwind classes. Headings use `font-serif` (EB Garamond); body text uses the default `font-sans` (Montserrat), both loaded in `src/app/[locale]/layout.tsx`. The crest logo lives at `public/brand/bawari-crest.png`; `src/app/icon.png` and `src/app/apple-icon.png` are square crops generated from it (Next.js App Router auto-detects these as favicon/app-icon — no `favicon.ico`).
