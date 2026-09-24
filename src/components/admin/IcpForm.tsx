"use client";

import { useState } from "react";
import { B2B_SEGMENT_LABELS } from "@/lib/labels";

export type IcpFormValues = {
  id?: string;
  name: string;
  segment: string;
  keywords: string[];
  location: string;
  employeeRangeMin: number | null;
  employeeRangeMax: number | null;
  notes: string;
};

export default function IcpForm({
  initialValues,
  onSaved,
  onCancel,
}: {
  initialValues?: IcpFormValues;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "error">(
    "idle",
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const formData = new FormData(event.currentTarget);
    const keywords = String(formData.get("keywords") ?? "")
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    const payload = {
      name: formData.get("name"),
      segment: formData.get("segment"),
      location: formData.get("location"),
      notes: formData.get("notes"),
      keywords,
      employeeRangeMin: formData.get("employeeRangeMin")
        ? Number(formData.get("employeeRangeMin"))
        : undefined,
      employeeRangeMax: formData.get("employeeRangeMax")
        ? Number(formData.get("employeeRangeMax"))
        : undefined,
    };

    const url = initialValues?.id
      ? `/api/admin/icp/${initialValues.id}`
      : "/api/admin/icp";
    const method = initialValues?.id ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setStatus("error");
      return;
    }

    setStatus("idle");
    onSaved();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-lg border border-brand-charcoal/10 bg-white p-6 sm:grid-cols-2"
    >
      <div>
        <label className="block text-xs font-medium text-brand-charcoal/70">
          Name *
        </label>
        <input
          name="name"
          required
          defaultValue={initialValues?.name}
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
          defaultValue={initialValues?.segment ?? ""}
          className="mt-1 w-full rounded-md border border-brand-charcoal/20 px-3 py-2 text-sm"
        >
          <option value="" disabled>
            Select a B2B segment
          </option>
          {Object.entries(B2B_SEGMENT_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-brand-charcoal/50">
          Apollo only has B2B company data — ICPs are limited to these two
          segments.
        </p>
      </div>
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-brand-charcoal/70">
          Keywords (comma-separated)
        </label>
        <input
          name="keywords"
          placeholder="restaurant, caterer, asian grocery"
          defaultValue={initialValues?.keywords.join(", ")}
          className="mt-1 w-full rounded-md border border-brand-charcoal/20 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-brand-charcoal/70">
          Location
        </label>
        <input
          name="location"
          placeholder="Berlin, Germany"
          defaultValue={initialValues?.location}
          className="mt-1 w-full rounded-md border border-brand-charcoal/20 px-3 py-2 text-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-brand-charcoal/70">
            Min employees
          </label>
          <input
            name="employeeRangeMin"
            type="number"
            min={0}
            defaultValue={initialValues?.employeeRangeMin ?? undefined}
            className="mt-1 w-full rounded-md border border-brand-charcoal/20 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-charcoal/70">
            Max employees
          </label>
          <input
            name="employeeRangeMax"
            type="number"
            min={0}
            defaultValue={initialValues?.employeeRangeMax ?? undefined}
            className="mt-1 w-full rounded-md border border-brand-charcoal/20 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-brand-charcoal/70">
          Notes
        </label>
        <textarea
          name="notes"
          rows={2}
          defaultValue={initialValues?.notes}
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
          {status === "submitting"
            ? "Saving…"
            : initialValues?.id
              ? "Save Changes"
              : "Create ICP"}
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
