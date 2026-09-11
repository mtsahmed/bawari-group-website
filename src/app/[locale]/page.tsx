import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type WhyItem = { title: string; description: string };

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Home");
  const why = t.raw("why") as WhyItem[];

  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
          {t("heroEyebrow")}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          {t("heroTitle")}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          {t("heroSubtitle")}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="rounded-md bg-gray-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700"
          >
            {t("heroCtaPrimary")}
          </Link>
          <Link
            href="/services"
            className="rounded-md border border-gray-300 px-5 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
          >
            {t("heroCtaSecondary")}
          </Link>
        </div>
      </section>

      <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">
              {t("whyTitle")}
            </h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {why.map((item) => (
              <div key={item.title}>
                <h3 className="text-base font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          {t("ctaBannerTitle")}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-gray-600">
          {t("ctaBannerSubtitle")}
        </p>
        <div className="mt-8">
          <Link
            href="/contact"
            className="rounded-md bg-gray-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700"
          >
            {t("ctaBannerButton")}
          </Link>
        </div>
      </section>
    </div>
  );
}
