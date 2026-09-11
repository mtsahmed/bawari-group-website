import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("About");

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
        {t("eyebrow")}
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-6 text-gray-600">{t("body1")}</p>
      <p className="mt-4 text-gray-600">{t("body2")}</p>

      <div className="mt-12 rounded-lg bg-gray-50 p-6">
        <h2 className="text-base font-semibold text-gray-900">
          {t("missionTitle")}
        </h2>
        <p className="mt-2 text-sm text-gray-600">{t("missionBody")}</p>
      </div>
    </div>
  );
}
