"use client";

import { useState } from "react";

export default function ApolloTestButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function handleClick() {
    setStatus("loading");
    const res = await fetch("/api/admin/settings/apollo-test");
    const data = await res.json();

    if (data.ok) {
      setStatus("ok");
    } else {
      setStatus("error");
      setMessage(data.message ?? "Connection failed.");
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={status === "loading"}
        className="rounded-md border border-brand-charcoal/20 px-4 py-2 text-sm font-medium text-brand-charcoal disabled:opacity-60"
      >
        {status === "loading" ? "Testing…" : "Test Apollo Connection"}
      </button>
      {status === "ok" && (
        <p className="mt-2 text-sm text-green-700">
          Connected — Apollo API key is working.
        </p>
      )}
      {status === "error" && (
        <p className="mt-2 text-sm text-red-600">{message}</p>
      )}
    </div>
  );
}
