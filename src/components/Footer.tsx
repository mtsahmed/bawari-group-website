import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("Footer");
  const nav = useTranslations("Nav");
  const year = new Date().getFullYear();

  const links = [
    { href: "/products", label: nav("products") },
    { href: "/quality", label: nav("quality") },
    { href: "/about", label: nav("about") },
    { href: "/contact", label: nav("contact") },
  ] as const;

  return (
    <footer className="mt-auto bg-brand-charcoal text-white/70">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/bawari-crest.png"
              alt={nav("brand")}
              width={36}
              height={46}
              className="h-9 w-auto"
            />
            <div>
              <p className="font-serif text-base font-semibold text-white">
                {nav("brand")}
              </p>
              <p className="mt-1 max-w-xs text-xs text-white/50">
                {t("tagline")}
              </p>
            </div>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/70 transition-colors hover:text-brand-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/40">
          {t("copyright", { year })}
        </div>
      </div>
    </footer>
  );
}
