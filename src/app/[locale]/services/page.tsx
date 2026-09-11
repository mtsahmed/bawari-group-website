import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type ServiceItem = { title: string; description: string };

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Services");
  const items = t.raw("items") as ServiceItem[];

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
        {t("eyebrow")}
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-2xl text-gray-600">{t("subtitle")}</p>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              {item.title}
            </h2>
            <p className="mt-2 text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
