"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-md border border-brand-charcoal/20 px-3 py-1.5 text-sm font-medium text-brand-charcoal transition-colors hover:border-brand-gold-dark hover:text-brand-gold-dark"
    >
      Sign Out
    </button>
  );
}
