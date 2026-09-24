"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddActivityForm({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!note.trim()) return;
    setSubmitting(true);

    await fetch(`/api/admin/leads/${leadId}/activity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });

    setNote("");
    setSubmitting(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note…"
        className="flex-1 rounded-md border border-brand-charcoal/20 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-brand-charcoal px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-gold-dark disabled:opacity-60"
      >
        Add
      </button>
    </form>
  );
}
