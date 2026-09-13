# Bawari Group Web App

The public website for Bawari Group, a Berlin/Hamburg-based importer and distributor of premium Pakistani basmati rice for the German market. See [PROJECT.md](./PROJECT.md) for the full project brief (the business, brand, site structure, open questions).

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com), themed with the Bawari Group brand palette (see `src/app/globals.css`)
- [next-intl](https://next-intl.dev) for locale-prefixed routing (`/en`, `/de`)
- EB Garamond (headings) + Montserrat (body/UI), per the brand guidelines

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to the default locale (`/en`).

## Project structure

```
src/
  app/[locale]/        # locale-scoped routes: home, products, quality, about, contact
  components/          # Header, Footer, ContactForm, LocaleSwitcher
  i18n/                # next-intl routing/navigation/request config
  proxy.ts             # locale detection middleware (Next.js "proxy" convention)
messages/
  en.json, de.json     # translated copy per locale
public/brand/
  bawari-crest.png     # the crest logo used on-site (transparent variant)
brand-assets/
  logos/, images/, documents/  # client-provided brand & business material (staging area, not all used yet)
```

To add a locale: add it to `locales` in `src/i18n/routing.ts` and create a matching `messages/<locale>.json`.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — lint the project
