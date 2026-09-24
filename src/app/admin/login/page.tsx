import LoginForm from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm rounded-lg border border-brand-gold/30 bg-white p-8 shadow-sm">
        <p className="text-center text-sm font-medium uppercase tracking-wide text-brand-gold-dark">
          Bawari Group
        </p>
        <h1 className="mt-2 text-center font-serif text-2xl font-semibold text-brand-charcoal">
          Admin Sign In
        </h1>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
