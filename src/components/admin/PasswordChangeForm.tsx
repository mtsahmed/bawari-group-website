"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PasswordChangeForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");

    if (password.length < 8) {
      setStatus("error");
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    setStatus("submitting");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }

    setStatus("success");
    event.currentTarget.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
      <div>
        <label className="block text-xs font-medium text-brand-charcoal/70">
          New password
        </label>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="mt-1 w-full rounded-md border border-brand-charcoal/20 px-3 py-2 text-sm"
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}
      {status === "success" && (
        <p className="text-sm text-green-700">Password updated.</p>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-md bg-brand-charcoal px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-gold-dark disabled:opacity-60"
      >
        {status === "submitting" ? "Updating…" : "Update Password"}
      </button>
    </form>
  );
}
