import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ContactForm from "@/components/ContactForm";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ContactPage() {
  const t = await getTranslations("Contact");

  return (
    <div className="mx-auto max-w-3xl px-6 py-20 sm:px-8 lg:px-12">
      <p className="text-base font-medium uppercase tracking-wide text-brand-gold-dark">
        {t("eyebrow")}
      </p>
      <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-brand-charcoal sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 text-brand-charcoal/70">{t("subtitle")}</p>

      <div className="mt-12">
        <ContactForm />
      </div>
    </div>
  );
}
