"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ContactForm() {
  const t = useTranslations("Contact");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company"),
      message: formData.get("message"),
    };

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setStatus(res.ok ? "success" : "error");
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-brand-charcoal/10 p-8 text-center">
        <h2 className="text-xl font-semibold text-brand-charcoal">
          {t("successTitle")}
        </h2>
        <p className="mt-2 text-base text-brand-charcoal/70">{t("successBody")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-base font-medium text-brand-charcoal"
        >
          {t("nameLabel")}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-2 block w-full rounded-md border border-brand-charcoal/20 px-3 py-2 text-base text-brand-charcoal"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-base font-medium text-brand-charcoal"
        >
          {t("emailLabel")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-2 block w-full rounded-md border border-brand-charcoal/20 px-3 py-2 text-base text-brand-charcoal"
        />
      </div>
      <div>
        <label
          htmlFor="company"
          className="block text-base font-medium text-brand-charcoal"
        >
          {t("companyLabel")}
        </label>
        <input
          id="company"
          name="company"
          type="text"
          className="mt-2 block w-full rounded-md border border-brand-charcoal/20 px-3 py-2 text-base text-brand-charcoal"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-base font-medium text-brand-charcoal"
        >
          {t("messageLabel")}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-2 block w-full rounded-md border border-brand-charcoal/20 px-3 py-2 text-base text-brand-charcoal"
        />
      </div>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-md bg-brand-charcoal px-5 py-3 text-base font-medium text-white transition-colors hover:bg-brand-gold-dark disabled:opacity-60"
      >
        {status === "submitting" ? t("submitting") : t("submit")}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-600">{t("errorMessage")}</p>
      )}
    </form>
  );
}
