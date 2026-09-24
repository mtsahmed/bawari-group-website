import { and, eq, ilike, or } from "drizzle-orm";
import { leads } from "@/lib/db/schema";
import { ALL_SEGMENTS, LEAD_SOURCES, LEAD_STATUSES } from "@/lib/validation";

export function buildLeadsWhere(searchParams: URLSearchParams) {
  const segment = searchParams.get("segment");
  const status = searchParams.get("status");
  const source = searchParams.get("source");
  const q = searchParams.get("q");

  const conditions = [];
  if (segment && (ALL_SEGMENTS as readonly string[]).includes(segment)) {
    conditions.push(eq(leads.segment, segment as (typeof ALL_SEGMENTS)[number]));
  }
  if (status && (LEAD_STATUSES as readonly string[]).includes(status)) {
    conditions.push(eq(leads.status, status as (typeof LEAD_STATUSES)[number]));
  }
  if (source && (LEAD_SOURCES as readonly string[]).includes(source)) {
    conditions.push(eq(leads.source, source as (typeof LEAD_SOURCES)[number]));
  }
  if (q) {
    conditions.push(
      or(ilike(leads.companyName, `%${q}%`), ilike(leads.contactName, `%${q}%`)),
    );
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
}
