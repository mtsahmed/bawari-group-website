"use client";

import { useState } from "react";

export default function FindLeadsButton({
  icpId,
  onDone,
}: {
  icpId: string;
  onDone: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [result, setResult] = useState<{
    created: number;
    skippedDuplicates: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleClick() {
    setStatus("loading");
    setResult(null);
    setErrorMessage("");

    const res = await fetch(`/api/admin/icp/${icpId}/find-leads`, {
      method: "POST",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setStatus("error");
      setErrorMessage(data.message ?? "Apollo search failed.");
      return;
    }

    const data = await res.json();
    setStatus("idle");
    setResult({ created: data.created, skippedDuplicates: data.skippedDuplicates });
    onDone();
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={status === "loading"}
        className="rounded-md border border-brand-gold-dark px-3 py-1.5 text-sm font-medium text-brand-gold-dark transition-colors hover:bg-brand-gold/10 disabled:opacity-60"
      >
        {status === "loading" ? "Searching Apollo…" : "Find Leads"}
      </button>
      {result && (
        <p className="mt-2 text-xs text-brand-charcoal/60">
          {result.created} lead{result.created === 1 ? "" : "s"} added
          {result.skippedDuplicates > 0
            ? `, ${result.skippedDuplicates} duplicate${result.skippedDuplicates === 1 ? "" : "s"} skipped`
            : ""}
          .
        </p>
      )}
      {status === "error" && (
        <p className="mt-2 text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}
