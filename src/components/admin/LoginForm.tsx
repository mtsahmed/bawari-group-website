"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setStatus("error");
      setErrorMessage("Invalid email or password.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-brand-charcoal"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1.5 block w-full rounded-md border border-brand-charcoal/20 px-3 py-2 text-sm text-brand-charcoal"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-brand-charcoal"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1.5 block w-full rounded-md border border-brand-charcoal/20 px-3 py-2 text-sm text-brand-charcoal"
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-md bg-brand-charcoal px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-gold-dark disabled:opacity-60"
      >
        {status === "submitting" ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
