import { NextResponse, type NextRequest } from "next/server";
import { desc, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { getSessionUser } from "@/lib/supabase/server";
import { buildLeadsWhere } from "@/lib/leads-filter";
import { leadCreateSchema } from "@/lib/validation";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const where = buildLeadsWhere(searchParams);

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
