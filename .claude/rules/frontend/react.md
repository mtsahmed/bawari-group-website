---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

# React / Next.js notes

Page components under `src/app/[locale]/**/page.tsx` are async Server Components — use `await getTranslations(...)` from `next-intl/server`, not the synchronous `useTranslations` hook (that's for Client Components and non-async server components like `Header`/`Footer`). See `AGENTS.md` for the full server-vs-client translation-hook gotcha.

Scoped via the `paths:` frontmatter above — Claude Code loads this only when it reads a matching `src/**/*.ts(x)` file, not on every session.
