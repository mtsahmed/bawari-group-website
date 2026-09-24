import PasswordChangeForm from "@/components/admin/PasswordChangeForm";
import ApolloTestButton from "@/components/admin/ApolloTestButton";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="font-serif text-2xl font-semibold text-brand-charcoal">
        Settings
      </h1>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-charcoal/60">
          Change Password
        </h2>
        <div className="mt-3">
          <PasswordChangeForm />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-charcoal/60">
          Apollo Integration
        </h2>
        <p className="mt-3 max-w-xl text-sm text-brand-charcoal/60">
          Apollo.io powers the &quot;Find Leads&quot; button on the ICP page
          — it can only source B2B companies (never individual consumers),
          which is why ICPs are restricted to the Food Service &amp; HORECA
          and Private Label &amp; B2B Retail segments.
        </p>
        <div className="mt-4">
          <ApolloTestButton />
        </div>
      </section>
    </div>
  );
}
