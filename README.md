# EcommerceServices Web App

A multi-language services website for an agency serving international ecommerce clients. See [PROJECT.md](./PROJECT.md) for the full project brief (goals, audience, site structure, open questions).

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [next-intl](https://next-intl.dev) for locale-prefixed routing (`/en`, `/de`, ...)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to the default locale (`/en`).

## Project structure

```
src/
  app/[locale]/       # locale-scoped routes (layout, home, services, case-studies, about, contact)
  components/          # Header, Footer, ContactForm, LocaleSwitcher
  i18n/                # next-intl routing/navigation/request config
  proxy.ts             # locale detection middleware (Next.js "proxy" convention)
messages/
  en.json, de.json     # translated copy per locale
```

To add a locale: add it to `locales` in `src/i18n/routing.ts` and create a matching `messages/<locale>.json`.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — lint the project
