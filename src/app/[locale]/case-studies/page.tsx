import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function CaseStudiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("CaseStudies");

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
        {t("eyebrow")}
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-2xl text-gray-600">{t("subtitle")}</p>

      <div className="mt-14 rounded-lg border border-dashed border-gray-300 p-10 text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          {t("comingSoonTitle")}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
          {t("comingSoonBody")}
        </p>
      </div>
    </div>
  );
}
