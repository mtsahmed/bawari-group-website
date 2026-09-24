import Link from "next/link";
import { desc, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { leadActivities, leads } from "@/lib/db/schema";
import { STATUS_LABELS, segmentLabel } from "@/lib/labels";

export default async function AdminDashboardPage() {
  const [statusCounts, segmentCounts, recentActivity, [{ total }]] =
    await Promise.all([
      db
        .select({ status: leads.status, count: sql<number>`count(*)::int` })
        .from(leads)
        .groupBy(leads.status),
      db
        .select({ segment: leads.segment, count: sql<number>`count(*)::int` })
        .from(leads)
        .groupBy(leads.segment),
      db
        .select({
          id: leadActivities.id,
          note: leadActivities.note,
          leadId: leadActivities.leadId,
          companyName: leads.companyName,
          createdAt: leadActivities.createdAt,
        })
        .from(leadActivities)
        .leftJoin(leads, sql`${leadActivities.leadId} = ${leads.id}`)
        .orderBy(desc(leadActivities.createdAt))
        .limit(8),
      db.select({ total: sql<number>`count(*)::int` }).from(leads),
    ]);

  const statusMap = Object.fromEntries(
    statusCounts.map((row) => [row.status, row.count]),
  );

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-brand-charcoal">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-brand-charcoal/60">
          {total} total lead{total === 1 ? "" : "s"}
        </p>
      </div>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-charcoal/60">
          By Status
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-5">
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <div
              key={key}
              className="rounded-lg border border-brand-charcoal/10 bg-white p-4"
            >
              <p className="text-2xl font-semibold text-brand-charcoal">
                {statusMap[key] ?? 0}
              </p>
              <p className="mt-1 text-xs text-brand-charcoal/60">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-charcoal/60">
          By Segment
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {segmentCounts.map((row) => (
            <div
              key={row.segment ?? "unclassified"}
              className="flex items-center justify-between rounded-lg border border-brand-charcoal/10 bg-white p-4"
            >
              <p className="text-sm text-brand-charcoal">
                {segmentLabel(row.segment)}
              </p>
              <p className="text-lg font-semibold text-brand-charcoal">
                {row.count}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-charcoal/60">
          Recent Activity
        </h2>
        <div className="mt-3 divide-y divide-brand-charcoal/10 rounded-lg border border-brand-charcoal/10 bg-white">
          {recentActivity.length === 0 && (
            <p className="p-4 text-sm text-brand-charcoal/50">
              No activity yet.
            </p>
          )}
          {recentActivity.map((activity) => (
            <Link
              key={activity.id}
              href={`/admin/leads/${activity.leadId}`}
              className="block p-4 text-sm hover:bg-brand-neutral"
            >
              <p className="font-medium text-brand-charcoal">
                {activity.companyName ?? "Unknown lead"}
              </p>
              <p className="mt-0.5 text-brand-charcoal/70">{activity.note}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
