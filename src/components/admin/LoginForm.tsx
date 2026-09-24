"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "forgot" | "forgot-sent">(
    "signin",
  );
  const [status, setStatus] = useState<"idle" | "submitting" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
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

  async function handleForgotPassword(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/auth/confirm?next=/admin/reset-password`,
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }

    setStatus("idle");
    setMode("forgot-sent");
  }

  if (mode === "forgot-sent") {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-brand-charcoal/70">
          If an account exists for that email, a password reset link has
          been sent. Check your inbox.
        </p>
        <button
          type="button"
          onClick={() => setMode("signin")}
          className="text-sm font-medium text-brand-gold-dark underline underline-offset-4"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  if (mode === "forgot") {
    return (
      <form onSubmit={handleForgotPassword} className="space-y-5">
        <p className="text-sm text-brand-charcoal/70">
          Enter your email and we&apos;ll send you a link to reset your
          password.
        </p>
        <div>
          <label
            htmlFor="forgot-email"
            className="block text-sm font-medium text-brand-charcoal"
          >
            Email
          </label>
          <input
            id="forgot-email"
            name="email"
            type="email"
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
          {status === "submitting" ? "Sending…" : "Send Reset Link"}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setStatus("idle");
            setErrorMessage("");
          }}
          className="block w-full text-center text-sm font-medium text-brand-charcoal/60 hover:text-brand-charcoal"
        >
          Back to sign in
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSignIn} className="space-y-5">
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
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-brand-charcoal"
          >
            Password
          </label>
          <button
            type="button"
            onClick={() => {
              setMode("forgot");
              setStatus("idle");
              setErrorMessage("");
            }}
            className="text-xs font-medium text-brand-gold-dark hover:underline"
          >
            Forgot password?
          </button>
        </div>
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
