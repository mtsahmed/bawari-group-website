import Link from "next/link";
import { desc, gte, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { leadActivities, leads } from "@/lib/db/schema";
import { SEGMENT_LABELS, STATUS_LABELS } from "@/lib/labels";
import PipelineBoard from "@/components/admin/PipelineBoard";
import {
  BarList,
  LeadsOverTimeChart,
  SourceDonut,
  type WeeklyBucket,
} from "@/components/admin/DashboardCharts";

const WEEKS_SHOWN = 12;
const DAY_MS = 86_400_000;

// Monday 00:00 UTC of the week containing `date` — matches Postgres's
// date_trunc('week', ...), which is ISO (Monday-start).
function weekStart(date: Date): Date {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d;
}

export default async function AdminDashboardPage() {
  const now = new Date();
  const firstWeek = weekStart(new Date(now.getTime() - (WEEKS_SHOWN - 1) * 7 * DAY_MS));
  const last30 = new Date(now.getTime() - 30 * DAY_MS);
  const prev30 = new Date(now.getTime() - 60 * DAY_MS);

  const [boardLeads, weeklyRows, recentActivity] = await Promise.all([
    db
      .select({
        id: leads.id,
        companyName: leads.companyName,
        contactName: leads.contactName,
        segment: leads.segment,
        source: leads.source,
        status: leads.status,
        createdAt: leads.createdAt,
      })
      .from(leads)
      .orderBy(desc(leads.updatedAt)),
    db
      .select({
        week: sql<string>`to_char(date_trunc('week', ${leads.createdAt}), 'YYYY-MM-DD')`,
        source: leads.source,
        count: sql<number>`count(*)::int`,
      })
      .from(leads)
      .where(gte(leads.createdAt, firstWeek))
      .groupBy(sql`1`, leads.source),
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
  ]);

  // All dashboard aggregates are derived from the one leads query above.
  const total = boardLeads.length;
  const countBy = (pick: (lead: (typeof boardLeads)[number]) => string) =>
    boardLeads.reduce<Record<string, number>>((acc, lead) => {
      const key = pick(lead);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
  const byStatus = countBy((l) => l.status);
  const bySource = countBy((l) => l.source);
  const bySegment = countBy((l) => l.segment ?? "unclassified");

  const addedLast30 = boardLeads.filter((l) => l.createdAt >= last30).length;
  const addedPrev30 = boardLeads.filter(
    (l) => l.createdAt >= prev30 && l.createdAt < last30,
  ).length;
  const activePipeline =
    (byStatus.contacted ?? 0) + (byStatus.meeting ?? 0) + (byStatus.qualified ?? 0);
  const closed = (byStatus.won ?? 0) + (byStatus.lost ?? 0);
  const winRate = closed ? Math.round(((byStatus.won ?? 0) / closed) * 100) : null;
  const needsTriage = bySegment.unclassified ?? 0;

  const weeks: WeeklyBucket[] = Array.from({ length: WEEKS_SHOWN }, (_, i) => {
    const start = new Date(firstWeek.getTime() + i * 7 * DAY_MS)
      .toISOString()
      .slice(0, 10);
    const counts: Record<string, number> = {};
    for (const row of weeklyRows) {
      if (row.week === start) counts[row.source] = row.count;
    }
    return { weekStart: start, counts };
  });

  const stageRows = Object.entries(STATUS_LABELS).map(([key, label]) => ({
    key,
    label,
    value: byStatus[key] ?? 0,
    muted: key === "lost",
  }));
  const segmentRows = [
    ...Object.entries(SEGMENT_LABELS)
      .map(([key, label]) => ({ key, label, value: bySegment[key] ?? 0 }))
      .sort((a, b) => b.value - a.value),
    {
      key: "unclassified",
      label: "Unclassified — needs triage",
      value: needsTriage,
      muted: true,
    },
  ];

  const delta = addedLast30 - addedPrev30;
  const kpis = [
    { label: "Total leads", value: String(total) },
    {
      label: "Added last 30 days",
      value: String(addedLast30),
      note:
        delta === 0
          ? "Same as previous 30 days"
          : `${delta > 0 ? "▲" : "▼"} ${Math.abs(delta)} vs previous 30 days`,
      noteClass:
        delta > 0 ? "text-emerald-700" : delta < 0 ? "text-red-700" : "",
    },
    {
      label: "Active pipeline",
      value: String(activePipeline),
      note: "Contacted, meeting or qualified",
    },
    {
      label: "Win rate",
      value: winRate === null ? "—" : `${winRate}%`,
      note: `${byStatus.won ?? 0} won of ${closed} closed`,
    },
    {
      label: "Needs triage",
      value: String(needsTriage),
      note: "No segment assigned yet",
      highlight: needsTriage > 0,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-brand-charcoal">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-brand-charcoal/60">
          Pipeline overview and lead statistics
        </p>
      </div>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className={`rounded-lg border bg-white p-4 ${
              kpi.highlight
                ? "border-brand-magenta-gold/40"
                : "border-brand-charcoal/10"
            }`}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-brand-charcoal/50">
              {kpi.label}
            </p>
            <p className="mt-2 text-3xl font-semibold text-brand-charcoal">
              {kpi.value}
            </p>
            {kpi.note && (
              <p
                className={`mt-1 text-xs ${kpi.noteClass || "text-brand-charcoal/50"}`}
              >
                {kpi.note}
              </p>
            )}
          </div>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <LeadsOverTimeChart weeks={weeks} />
        <SourceDonut counts={bySource} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BarList
          title="Pipeline by stage"
          subtitle="Current status of every lead"
          rows={stageRows}
          color="#a4793b"
        />
        <BarList
          title="Leads by segment"
          subtitle="Target market split"
          rows={segmentRows}
          color="#343b3c"
        />
      </div>

      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-xl font-semibold text-brand-charcoal">
            Pipeline board
          </h2>
          <Link
            href="/admin/leads"
            className="text-sm font-medium text-brand-gold-dark hover:underline"
          >
            Table view →
          </Link>
        </div>
        <p className="mt-1 text-sm text-brand-charcoal/60">
          Drag a lead to another stage to update its status. Each move is
          logged in the lead&apos;s activity.
        </p>
        <div className="mt-4">
          <PipelineBoard
            leads={boardLeads.map((lead) => ({
              ...lead,
              createdAt: lead.createdAt.toISOString(),
            }))}
          />
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
