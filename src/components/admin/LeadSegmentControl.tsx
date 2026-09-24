"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SEGMENT_LABELS } from "@/lib/labels";

export default function LeadSegmentControl({
  leadId,
  currentSegment,
}: {
  leadId: string;
  currentSegment: string | null;
}) {
  const router = useRouter();
  const [segment, setSegment] = useState(currentSegment ?? "");
  const [saving, setSaving] = useState(false);

  async function handleChange(newSegment: string) {
    setSegment(newSegment);
    setSaving(true);
    await fetch(`/api/admin/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ segment: newSegment }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <select
      value={segment}
      disabled={saving}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-md border border-brand-charcoal/20 px-3 py-2 text-sm"
    >
      <option value="" disabled>
        Assign a segment…
      </option>
      {Object.entries(SEGMENT_LABELS).map(([key, label]) => (
        <option key={key} value={key}>
          {label}
        </option>
      ))}
    </select>
  );
}
