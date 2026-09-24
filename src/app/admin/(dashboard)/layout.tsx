import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import LogoutButton from "@/components/admin/LogoutButton";
import { getSessionUser } from "@/lib/supabase/server";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-brand-charcoal/10 bg-white px-8 py-4">
          <p className="text-sm text-brand-charcoal/60">{user.email}</p>
          <LogoutButton />
        </header>
        <main className="px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
