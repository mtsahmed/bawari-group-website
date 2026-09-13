import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ContactForm from "@/components/ContactForm";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Contact");

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <p className="text-sm font-medium uppercase tracking-wide text-brand-gold-dark">
        {t("eyebrow")}
      </p>
      <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-brand-charcoal sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-4 text-brand-charcoal/70">{t("subtitle")}</p>

      <div className="mt-12">
        <ContactForm />
      </div>
    </div>
  );
}
