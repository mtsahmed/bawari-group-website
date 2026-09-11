import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-200">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-gray-500">
        {t("copyright", { year })}
      </div>
    </footer>
  );
}
