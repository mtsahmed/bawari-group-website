import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type City = { title: string; role: string; description: string };

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("About");
  const cities = t.raw("cities") as City[];
  const leadership = t.raw("leadership") as string[];

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-sm font-medium uppercase tracking-wide text-brand-gold-dark">
        {t("eyebrow")}
      </p>
      <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-brand-charcoal sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-6 text-brand-charcoal/70">{t("body1")}</p>
      <p className="mt-4 text-brand-charcoal/70">{t("body2")}</p>

      <h2 className="mt-16 font-serif text-xl font-semibold text-brand-charcoal">
        {t("modelTitle")}
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {cities.map((city) => (
          <div
            key={city.title}
            className="rounded-lg border border-brand-charcoal/10 p-6"
          >
            <h3 className="font-serif text-lg font-semibold text-brand-charcoal">
              {city.title}
            </h3>
            <p className="mt-1 text-sm font-medium text-brand-gold-dark">
              {city.role}
            </p>
            <p className="mt-2 text-sm text-brand-charcoal/70">
              {city.description}
            </p>
          </div>
        ))}
      </div>

      <h2 className="mt-16 font-serif text-xl font-semibold text-brand-charcoal">
        {t("leadershipTitle")}
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {leadership.map((name) => (
          <div
            key={name}
            className="rounded-lg bg-brand-neutral p-5 text-center"
          >
            <p className="font-serif text-base font-semibold text-brand-charcoal">
              {name}
            </p>
            <p className="mt-1 text-xs text-brand-charcoal/60">
              {t("leadershipRole")}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-lg bg-brand-charcoal p-6 text-white">
        <h2 className="font-serif text-base font-semibold">
          {t("missionTitle")}
        </h2>
        <p className="mt-2 text-sm text-white/70">{t("missionBody")}</p>
      </div>
    </div>
  );
}
