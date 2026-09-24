import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Step = { title: string; description: string };

export default async function QualityPage() {
  const t = await getTranslations("Quality");
  const programme = t.raw("programme") as Step[];

  return (
    <div className="mx-auto max-w-[90rem] px-6 py-20 sm:px-8 lg:px-12">
      <p className="text-base font-medium uppercase tracking-wide text-brand-gold-dark">
        {t("eyebrow")}
      </p>
      <h1 className="mt-4 text-center font-serif text-4xl font-semibold tracking-tight text-brand-charcoal sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mx-auto mt-4 max-w-5xl text-xl text-brand-charcoal/70">{t("subtitle")}</p>

      <div className="mx-auto mt-14 max-w-5xl rounded-lg bg-brand-neutral p-8">
        <h2 className="font-serif text-2xl font-semibold text-brand-charcoal">
          {t("sourcingTitle")}
        </h2>
        <p className="mt-3 text-xl text-brand-charcoal/70">
          {t("sourcingBody")}
        </p>
      </div>

      <figure className="mt-16">
        <h2 className="font-serif text-2xl font-semibold text-brand-charcoal">
          {t("routeTitle")}
        </h2>
        <div className="mt-6 overflow-hidden rounded-lg border border-brand-charcoal/10">
          <Image
            src="/brand/supply-chain-map.png"
            alt={t("routeTitle")}
            width={2600}
            height={3266}
            className="w-full"
          />
        </div>
        <figcaption className="mt-3 text-base text-brand-charcoal/50 xl:whitespace-nowrap">
          {t("routeCaption")}
        </figcaption>
      </figure>

      <figure className="mt-16">
        <h2 className="font-serif text-2xl font-semibold text-brand-charcoal">
          {t("processTitle")}
        </h2>
        <div className="mt-6 overflow-hidden rounded-lg border border-brand-charcoal/10">
          <Image
            src="/brand/import-process-flow.png"
            alt={t("processTitle")}
            width={2400}
            height={3840}
            className="w-full"
          />
        </div>
        <figcaption className="mt-3 text-base text-brand-charcoal/50 xl:whitespace-nowrap">
          {t("processCaption")}
        </figcaption>
      </figure>

      <h2 className="mt-16 font-serif text-2xl font-semibold text-brand-charcoal">
        {t("programmeTitle")}
      </h2>
      <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {programme.map((step, index) => (
          <li
            key={step.title}
            className="flex gap-4 rounded-lg border border-brand-charcoal/10 p-5"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-charcoal text-base font-semibold text-brand-gold">
              {index + 1}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-brand-charcoal">
                {step.title}
              </h3>
              <p className="mt-1 text-base text-brand-charcoal/70">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <figure className="mt-10">
        <div className="overflow-hidden rounded-lg border border-brand-charcoal/10">
          <Image
            src="/brand/qa-programme.png"
            alt={t("programmeTitle")}
            width={3200}
            height={2560}
            className="w-full"
          />
        </div>
        <figcaption className="mt-3 text-base text-brand-charcoal/50 xl:whitespace-nowrap">
          {t("programmeCaption")}
        </figcaption>
      </figure>

      <p className="mx-auto mt-10 max-w-5xl border-t border-brand-charcoal/10 pt-6 text-xl text-[#2B47F1]">
        {t("complianceNote")}
      </p>
    </div>
  );
}
