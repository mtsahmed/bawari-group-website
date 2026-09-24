import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { leadActivities, leads } from "@/lib/db/schema";
import { SOURCE_LABELS, segmentLabel } from "@/lib/labels";
import LeadStatusControl from "@/components/admin/LeadStatusControl";
import LeadSegmentControl from "@/components/admin/LeadSegmentControl";
import AddActivityForm from "@/components/admin/AddActivityForm";

export default async function AdminLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [lead] = await db.select().from(leads).where(eq(leads.id, id));
  if (!lead) {
    notFound();
  }

  const activities = await db
    .select()
    .from(leadActivities)
    .where(eq(leadActivities.leadId, id))
    .orderBy(leadActivities.createdAt);

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-brand-charcoal">
            {lead.companyName}
          </h1>
          {lead.contactName && (
            <p className="mt-1 text-sm text-brand-charcoal/60">
              {lead.contactName}
            </p>
          )}
          <p className="mt-1 text-sm text-brand-charcoal/60">
            {segmentLabel(lead.segment)} ·{" "}
            {SOURCE_LABELS[lead.source] ?? lead.source}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <LeadSegmentControl leadId={lead.id} currentSegment={lead.segment} />
          <LeadStatusControl leadId={lead.id} currentStatus={lead.status} />
        </div>
      </div>

      <section className="grid gap-4 rounded-lg border border-brand-charcoal/10 bg-white p-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-brand-charcoal/50">
            Email
          </p>
          <p className="mt-1 text-sm text-brand-charcoal">
            {lead.email ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-brand-charcoal/50">
            Phone
          </p>
          <p className="mt-1 text-sm text-brand-charcoal">
            {lead.phone ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-brand-charcoal/50">
            Website
          </p>
          <p className="mt-1 text-sm text-brand-charcoal">
            {lead.website ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-brand-charcoal/50">
            LinkedIn
          </p>
          <p className="mt-1 text-sm text-brand-charcoal">
            {lead.linkedinUrl ?? "—"}
          </p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-charcoal/50">
            Address
          </p>
          <p className="mt-1 text-sm text-brand-charcoal">
            {lead.address ?? "—"}
          </p>
        </div>
        {lead.notes && (
          <div className="sm:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-brand-charcoal/50">
              Notes
            </p>
            <p className="mt-1 text-sm text-brand-charcoal">{lead.notes}</p>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-charcoal/60">
          Activity
        </h2>
        <div className="mt-3 space-y-3">
          <AddActivityForm leadId={lead.id} />
          <div className="divide-y divide-brand-charcoal/10 rounded-lg border border-brand-charcoal/10 bg-white">
            {activities.length === 0 && (
              <p className="p-4 text-sm text-brand-charcoal/50">
                No activity yet.
              </p>
            )}
            {activities.map((activity) => (
              <div key={activity.id} className="p-4">
                <p className="text-sm text-brand-charcoal">{activity.note}</p>
                <p className="mt-1 text-xs text-brand-charcoal/50">
                  {new Date(activity.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
