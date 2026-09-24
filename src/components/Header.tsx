import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LocaleSwitcher from "./LocaleSwitcher";

export default function Header() {
  const t = useTranslations("Nav");

  const links = [
    { href: "/", label: t("home") },
    { href: "/products", label: t("products") },
    { href: "/quality", label: t("quality") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ] as const;

  return (
    <header className="border-b border-brand-charcoal/10 bg-white">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/brand/bawari-crest.png"
            alt={t("brand")}
            width={40}
            height={51}
            className="h-10 w-auto"
            priority
          />
          <span className="font-serif text-[24px] font-semibold tracking-tight text-brand-charcoal">
            {t("brand")}
          </span>
        </Link>
        <nav className="hidden items-center gap-6 sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base text-brand-charcoal/70 transition-colors hover:text-brand-gold-dark"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          <Link
            href="/contact"
            className="rounded-md bg-brand-charcoal px-4 py-2 text-base font-medium text-white transition-colors hover:bg-brand-gold-dark"
          >
            {t("cta")}
          </Link>
        </div>
      </div>
    </header>
  );
}
