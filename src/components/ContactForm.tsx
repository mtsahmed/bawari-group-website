"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ContactForm() {
  const t = useTranslations("Contact");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle"
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    // No backend wired up yet — see PROJECT.md open questions.
    setTimeout(() => setStatus("success"), 400);
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-gray-200 p-8 text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          {t("successTitle")}
        </h2>
        <p className="mt-2 text-sm text-gray-600">{t("successBody")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-900"
        >
          {t("nameLabel")}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-900"
        >
          {t("emailLabel")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
        />
      </div>
      <div>
        <label
          htmlFor="company"
          className="block text-sm font-medium text-gray-900"
        >
          {t("companyLabel")}
        </label>
        <input
          id="company"
          name="company"
          type="text"
          className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-900"
        >
          {t("messageLabel")}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
        />
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-md bg-gray-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:opacity-60"
      >
        {status === "submitting" ? t("submitting") : t("submit")}
      </button>
      <p className="text-xs text-gray-400">{t("formNote")}</p>
    </form>
  );
}
