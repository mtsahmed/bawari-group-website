import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Item = { title: string; description: string; badge?: string };

function Badge({ label }: { label: string }) {
  return (
    <span className="mt-2 inline-block rounded-full bg-brand-gold-dark/10 px-3 py-1 text-xs font-semibold text-brand-gold-dark">
      {label}
    </span>
  );
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Products");
  const portfolio = t.raw("portfolio") as Item[];
  const packaging = t.raw("packaging") as Item[];
  const services = t.raw("services") as Item[];

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-sm font-medium uppercase tracking-wide text-brand-gold-dark">
        {t("eyebrow")}
      </p>
      <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-brand-charcoal sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-2 font-serif text-lg italic text-brand-charcoal/80">
        {t("tagline")}
      </p>
      <p className="mt-4 max-w-2xl text-brand-charcoal/70">{t("subtitle")}</p>

      <h2 className="mt-16 font-serif text-xl font-semibold text-brand-charcoal">
        {t("portfolioTitle")}
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {portfolio.map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-brand-charcoal/10 p-6"
          >
            <h3 className="text-lg font-semibold text-brand-charcoal">
              {item.title}
            </h3>
            <p className="mt-2 text-sm text-brand-charcoal/70">
              {item.description}
            </p>
            {item.badge && <Badge label={item.badge} />}
          </div>
        ))}
      </div>

      <h2 className="mt-16 font-serif text-xl font-semibold text-brand-charcoal">
        {t("packagingTitle")}
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {packaging.map((item) => (
          <div key={item.title} className="rounded-lg bg-brand-neutral p-6">
            <h3 className="text-base font-semibold text-brand-charcoal">
              {item.title}
            </h3>
            <p className="mt-2 text-sm text-brand-charcoal/70">
              {item.description}
            </p>
            {item.badge && <Badge label={item.badge} />}
          </div>
        ))}
      </div>

      <h2 className="mt-16 font-serif text-xl font-semibold text-brand-charcoal">
        {t("servicesTitle")}
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {services.map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-brand-charcoal/10 p-6"
          >
            <h3 className="text-base font-semibold text-brand-charcoal">
              {item.title}
            </h3>
            <p className="mt-2 text-sm text-brand-charcoal/70">
              {item.description}
            </p>
            {item.badge && <Badge label={item.badge} />}
          </div>
        ))}
      </div>
    </div>
  );
}
