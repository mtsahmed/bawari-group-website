import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ProductJarIcon } from "@/components/ProductJarIcon";
import { ServiceIcon } from "@/components/ServiceIcon";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Item = { title: string; description: string; badge?: string };

// Exact fills lifted from brand-assets/images/Bawari Group - Products & Services Webpage.svg
const NEUTRAL_BG = "#F7F5F0";
const CARD_BORDER = "#E7E3D8";
const BODY_MUTED = "#6E7674";

const PORTFOLIO_STYLES = [
  { accent: "#B9862E", grain: "#EDE2C4", pillLabel: "SUPER" }, // Super Basmati
  { accent: "#C1622D", grain: "#EDE2C4", pillLabel: "KERNEL" }, // Kernel Basmati
  { accent: "#1F6F78", grain: "#D9A441", pillLabel: "SELLA" }, // Sella Basmati
  { accent: "#3B5488", grain: "#F2ECDC", pillLabel: "STEAM" }, // Steam Basmati
  { accent: "#2E7D5B", grain: "#8B6239", pillLabel: "BROWN" }, // Brown Basmati
  { accent: "#8B3A4A", grain: "#F0EAE0", pillLabel: "LONG GRAIN" }, // Long-Grain Rice
];

type PackagingStyle = {
  accent: string;
  grain: string;
  pillLabel: string;
  badgeColor?: string;
};

const PACKAGING_STYLES: PackagingStyle[] = [
  { accent: "#B9862E", grain: "#EDE2C4", pillLabel: "SUPER" }, // Retail
  { accent: "#1F6F78", grain: "#D9A441", pillLabel: "SELLA" }, // Food Service
  { accent: "#9A9488", grain: "#EDE2C4", pillLabel: "YOUR BRAND", badgeColor: "#7A756A" }, // Private Label
];

const SERVICE_STYLES: Array<{
  icon: "customs" | "wholesale" | "label" | "organic";
  accent: string;
}> = [
  { icon: "customs", accent: "#A4793B" },
  { icon: "wholesale", accent: "#1F6F78" },
  { icon: "label", accent: "#8B3A6B" },
  { icon: "organic", accent: "#2E7D5B" },
];

function withAlpha(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function TintedBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="mt-3 inline-block rounded-full px-3 py-1 text-sm font-semibold"
      style={{ backgroundColor: withAlpha(color, 0.13), color }}
    >
      {label}
    </span>
  );
}

function SolidBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-block rounded-full px-3 py-1 text-sm font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}

export default async function ProductsPage() {
  const t = await getTranslations("Products");
  const portfolio = t.raw("portfolio") as Item[];
  const packaging = t.raw("packaging") as Item[];
  const services = t.raw("services") as Item[];
  const heroBadges = t.raw("heroBadges") as string[];

  return (
    <div>
      <section
        className="text-white"
        style={{
          background: "linear-gradient(135deg, #232B2C 0%, #39433F 100%)",
        }}
      >
        <div className="mx-auto grid max-w-[90rem] gap-10 px-6 py-20 sm:px-8 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:px-12">
          <div>
            <p className="text-base font-medium uppercase tracking-wide text-brand-gold">
              {t("eyebrow")}
            </p>
            <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-2 font-serif text-xl italic text-white/80">
              {t("tagline")}
            </p>
            <p className="mt-4 max-w-2xl" style={{ color: "#C9CCC7" }}>
              {t("subtitle")}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {heroBadges.map((label, i) =>
                i === 0 ? (
                  <SolidBadge key={label} label={label} color="#C99A50" />
                ) : (
                  <TintedBadge key={label} label={label} color="#C99A50" />
                )
              )}
            </div>
          </div>
          <div className="hidden items-end justify-center gap-2 lg:flex">
            <ProductJarIcon {...PORTFOLIO_STYLES[2]} className="h-28 w-auto opacity-90" />
            <ProductJarIcon {...PORTFOLIO_STYLES[0]} className="h-40 w-auto" />
            <ProductJarIcon {...PORTFOLIO_STYLES[4]} className="h-28 w-auto opacity-90" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[90rem] px-6 py-20 sm:px-8 lg:px-12">
        <h2 className="font-serif text-2xl font-semibold text-brand-charcoal">
          {t("portfolioTitle")}
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolio.map((item, index) => {
            const style = PORTFOLIO_STYLES[index % PORTFOLIO_STYLES.length];
            return (
              <div
                key={item.title}
                className="rounded-lg bg-white p-6 shadow-sm"
                style={{ border: `1.4px solid ${CARD_BORDER}` }}
              >
                <ProductJarIcon {...style} className="h-28 w-auto" />
                <h3 className="mt-4 text-xl font-semibold text-brand-charcoal">
                  {item.title}
                </h3>
                <p className="mt-2 text-base" style={{ color: BODY_MUTED }}>
                  {item.description}
                </p>
                {item.badge && <TintedBadge label={item.badge} color={style.accent} />}
              </div>
            );
          })}
        </div>
      </div>

      <section style={{ backgroundColor: NEUTRAL_BG }}>
        <div className="mx-auto max-w-[90rem] px-6 py-20 sm:px-8 lg:px-12">
          <h2 className="font-serif text-2xl font-semibold text-brand-charcoal">
            {t("packagingTitle")}
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {packaging.map((item, index) => {
              const style = PACKAGING_STYLES[index % PACKAGING_STYLES.length];
              return (
                <div
                  key={item.title}
                  className="rounded-lg bg-white p-6 shadow-sm"
                  style={{ border: `1.4px solid ${CARD_BORDER}` }}
                >
                  <ProductJarIcon {...style} className="h-28 w-auto" />
                  <h3 className="mt-4 text-lg font-semibold text-brand-charcoal">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-base" style={{ color: BODY_MUTED }}>
                    {item.description}
                  </p>
                  {item.badge && (
                    <div className="mt-3">
                      <SolidBadge
                        label={item.badge}
                        color={style.badgeColor ?? style.accent}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[90rem] px-6 py-20 sm:px-8 lg:px-12">
        <h2 className="font-serif text-2xl font-semibold text-brand-charcoal">
          {t("servicesTitle")}
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((item, index) => {
            const style = SERVICE_STYLES[index % SERVICE_STYLES.length];
            const isFeatured = index === 0;
            return (
              <div
                key={item.title}
                className={
                  isFeatured
                    ? "relative rounded-lg p-6 text-white sm:col-span-2"
                    : "relative rounded-lg bg-white p-6"
                }
                style={
                  isFeatured
                    ? { backgroundColor: "#232B2C" }
                    : { backgroundColor: NEUTRAL_BG, border: `1.2px solid ${CARD_BORDER}` }
                }
              >
                {item.badge && (
                  <span className="absolute right-5 top-5">
                    <SolidBadge label={item.badge} color={style.accent} />
                  </span>
                )}
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: style.accent }}
                >
                  <ServiceIcon name={style.icon} accent={style.accent} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p
                  className="mt-2 text-base"
                  style={{ color: isFeatured ? "#D8D6CE" : BODY_MUTED }}
                >
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
