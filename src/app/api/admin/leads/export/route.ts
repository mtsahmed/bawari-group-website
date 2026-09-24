import { type NextRequest } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { getSessionUser } from "@/lib/supabase/server";
import { buildLeadsWhere } from "@/lib/leads-filter";
import { SEGMENT_LABELS, SOURCE_LABELS, STATUS_LABELS } from "@/lib/labels";

const COLUMNS = [
  "Company",
  "Contact Name",
  "Segment",
  "Status",
  "Source",
  "Email",
  "Phone",
  "Website",
  "LinkedIn",
  "Address",
  "Notes",
  "Created At",
] as const;

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const where = buildLeadsWhere(request.nextUrl.searchParams);
  const rows = await db
    .select()
    .from(leads)
    .where(where)
    .orderBy(desc(leads.createdAt));

  const lines = [COLUMNS.join(",")];
  for (const lead of rows) {
    lines.push(
      [
        lead.companyName,
        lead.contactName ?? "",
        lead.segment ? (SEGMENT_LABELS[lead.segment] ?? lead.segment) : "",
        STATUS_LABELS[lead.status] ?? lead.status,
        SOURCE_LABELS[lead.source] ?? lead.source,
        lead.email ?? "",
        lead.phone ?? "",
        lead.website ?? "",
        lead.linkedinUrl ?? "",
        lead.address ?? "",
        lead.notes ?? "",
        lead.createdAt.toISOString(),
      ]
        .map((v) => csvEscape(String(v)))
        .join(","),
    );
  }

  const csv = lines.join("\r\n");
  const filename = `bawari-leads-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
