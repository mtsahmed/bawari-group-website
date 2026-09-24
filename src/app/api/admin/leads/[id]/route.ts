import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { leadActivities, leads } from "@/lib/db/schema";
import { getSessionUser } from "@/lib/supabase/server";
import { leadUpdateSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const [lead] = await db.select().from(leads).where(eq(leads.id, id));
  if (!lead) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const activities = await db
    .select()
    .from(leadActivities)
    .where(eq(leadActivities.leadId, id))
    .orderBy(leadActivities.createdAt);

  return NextResponse.json({ lead, activities });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = leadUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const [lead] = await db
    .update(leads)
    .set({
      ...parsed.data,
      email: parsed.data.email || undefined,
      updatedAt: new Date(),
    })
    .where(eq(leads.id, id))
    .returning();

  if (!lead) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ lead });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await db.delete(leads).where(eq(leads.id, id));

  return NextResponse.json({ ok: true });
}
