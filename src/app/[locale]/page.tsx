import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type City = { title: string; role: string; description: string };
type Segment = { title: string; description: string };

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Home");
  const cities = t.raw("cities") as City[];
  const segments = t.raw("segments") as Segment[];

  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-brand-gold-dark">
          {t("heroEyebrow")}
        </p>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-brand-charcoal sm:text-5xl">
          {t("heroTitle")}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-brand-charcoal/70">
          {t("heroSubtitle")}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="rounded-md bg-brand-charcoal px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-gold-dark"
          >
            {t("heroCtaPrimary")}
          </Link>
          <Link
            href="/products"
            className="rounded-md border border-brand-charcoal/20 px-5 py-3 text-sm font-medium text-brand-charcoal transition-colors hover:border-brand-gold-dark hover:text-brand-gold-dark"
          >
            {t("heroCtaSecondary")}
          </Link>
        </div>
      </section>

      <section className="border-t border-brand-charcoal/10 bg-brand-neutral">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-semibold text-brand-charcoal">
              {t("modelTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-brand-charcoal/70">
              {t("modelSubtitle")}
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {cities.map((city) => (
              <div
                key={city.title}
                className="rounded-lg border border-brand-charcoal/10 bg-white p-6"
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
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <h2 className="font-serif text-2xl font-semibold text-brand-charcoal">
            {t("segmentsTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-brand-charcoal/70">
            {t("segmentsSubtitle")}
          </p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {segments.map((segment) => (
            <div key={segment.title}>
              <h3 className="text-base font-semibold text-brand-charcoal">
                {segment.title}
              </h3>
              <p className="mt-2 text-sm text-brand-charcoal/70">
                {segment.description}
              </p>
            </div>
          ))}
        </div>

        <figure className="mx-auto mt-16 max-w-4xl">
          <div className="overflow-hidden rounded-lg border border-brand-charcoal/10">
            <Image
              src="/brand/retail-network.png"
              alt={t("segmentsTitle")}
              width={3000}
              height={2700}
              className="w-full"
            />
          </div>
          <figcaption className="mt-3 text-center text-xs text-brand-charcoal/50">
            {t("networkCaption")}
          </figcaption>
        </figure>
      </section>

      <section className="border-t border-brand-charcoal/10 bg-brand-charcoal text-white">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="font-serif text-2xl font-semibold">
            {t("qualityTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70">
            {t("qualitySubtitle")}
          </p>
          <div className="mt-8">
            <Link
              href="/quality"
              className="rounded-md bg-brand-gold px-5 py-3 text-sm font-medium text-brand-charcoal transition-colors hover:bg-white"
            >
              {t("qualityCtaLabel")}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="font-serif text-2xl font-semibold text-brand-charcoal">
          {t("ctaBannerTitle")}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-brand-charcoal/70">
          {t("ctaBannerSubtitle")}
        </p>
        <div className="mt-8">
          <Link
            href="/contact"
            className="rounded-md bg-brand-charcoal px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-gold-dark"
          >
            {t("ctaBannerButton")}
          </Link>
        </div>
      </section>
    </div>
  );
}
