"use client";

import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    router.replace(
      // @ts-expect-error -- pathname/params are dynamic per-route
      { pathname, params },
      { locale: nextLocale }
    );
  }

  return (
    <label className="inline-flex items-center gap-2 text-base">
      <span className="sr-only">{t("label")}</span>
      <select
        value={locale}
        onChange={onChange}
        className="rounded-md border border-brand-charcoal/20 bg-white px-2 py-1 text-base text-brand-charcoal"
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc}>
            {t("locale", { locale: loc })}
          </option>
        ))}
      </select>
    </label>
  );
}
