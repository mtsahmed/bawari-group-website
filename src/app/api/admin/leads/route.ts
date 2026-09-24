import { NextResponse, type NextRequest } from "next/server";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { getSessionUser } from "@/lib/supabase/server";
import {
  ALL_SEGMENTS,
  LEAD_SOURCES,
  LEAD_STATUSES,
  leadCreateSchema,
} from "@/lib/validation";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const segment = searchParams.get("segment");
  const status = searchParams.get("status");
  const source = searchParams.get("source");
  const q = searchParams.get("q");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

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

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [rows, [{ count }]] = await Promise.all([
    db
      .select()
      .from(leads)
      .where(where)
      .orderBy(desc(leads.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(leads)
      .where(where),
  ]);

  return NextResponse.json({
    leads: rows,
    total: count,
    page,
    pageSize: PAGE_SIZE,
  });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = leadCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const [lead] = await db
    .insert(leads)
    .values({
      ...parsed.data,
      email: parsed.data.email || undefined,
      source: "manual",
      status: "new",
    })
    .returning();

  return NextResponse.json({ lead }, { status: 201 });
}
