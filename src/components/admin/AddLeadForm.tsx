"use client";

import { useState } from "react";
import { SEGMENT_LABELS } from "@/lib/labels";

export default function AddLeadForm({
  onCreated,
  onCancel,
}: {
  onCreated: () => void;
  onCancel: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "error">(
    "idle",
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const res = await fetch("/api/admin/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setStatus("error");
      return;
    }

    setStatus("idle");
    onCreated();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-lg border border-brand-charcoal/10 bg-white p-6 sm:grid-cols-2"
    >
      <div>
        <label className="block text-xs font-medium text-brand-charcoal/70">
          Company name *
        </label>
        <input
          name="companyName"
          required
          className="mt-1 w-full rounded-md border border-brand-charcoal/20 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-brand-charcoal/70">
          Contact name
        </label>
        <input
          name="contactName"
          className="mt-1 w-full rounded-md border border-brand-charcoal/20 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-brand-charcoal/70">
          Segment *
        </label>
        <select
          name="segment"
          required
          defaultValue=""
          className="mt-1 w-full rounded-md border border-brand-charcoal/20 px-3 py-2 text-sm"
        >
          <option value="" disabled>
            Select a segment
          </option>
          {Object.entries(SEGMENT_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-brand-charcoal/70">
          Email
        </label>
        <input
          name="email"
          type="email"
          className="mt-1 w-full rounded-md border border-brand-charcoal/20 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-brand-charcoal/70">
          Phone
        </label>
        <input
          name="phone"
          className="mt-1 w-full rounded-md border border-brand-charcoal/20 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-brand-charcoal/70">
          Website
        </label>
        <input
          name="website"
          className="mt-1 w-full rounded-md border border-brand-charcoal/20 px-3 py-2 text-sm"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-brand-charcoal/70">
          Address
        </label>
        <input
          name="address"
          className="mt-1 w-full rounded-md border border-brand-charcoal/20 px-3 py-2 text-sm"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-brand-charcoal/70">
          Notes
        </label>
        <textarea
          name="notes"
          rows={3}
          className="mt-1 w-full rounded-md border border-brand-charcoal/20 px-3 py-2 text-sm"
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-600 sm:col-span-2">
          Something went wrong — check the required fields and try again.
        </p>
      )}
      <div className="flex gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-md bg-brand-charcoal px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-gold-dark disabled:opacity-60"
        >
          {status === "submitting" ? "Adding…" : "Add Lead"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-brand-charcoal/20 px-4 py-2 text-sm font-medium text-brand-charcoal"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
