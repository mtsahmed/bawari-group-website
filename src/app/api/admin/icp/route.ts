import { NextResponse, type NextRequest } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { icps } from "@/lib/db/schema";
import { getSessionUser } from "@/lib/supabase/server";
import { icpCreateSchema } from "@/lib/validation";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db.select().from(icps).orderBy(desc(icps.createdAt));
  return NextResponse.json({ icps: rows });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = icpCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const [icp] = await db.insert(icps).values(parsed.data).returning();
  return NextResponse.json({ icp }, { status: 201 });
}
