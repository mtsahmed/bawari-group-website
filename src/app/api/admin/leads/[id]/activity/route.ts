import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { leadActivities, leads } from "@/lib/db/schema";
import { getSessionUser } from "@/lib/supabase/server";
import { leadActivitySchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = leadActivitySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const [activity] = await db
    .insert(leadActivities)
    .values({
      leadId: id,
      note: parsed.data.note,
      statusAtTime: parsed.data.statusAtTime,
    })
    .returning();

  if (parsed.data.statusAtTime) {
    await db
      .update(leads)
      .set({ status: parsed.data.statusAtTime, updatedAt: new Date() })
      .where(eq(leads.id, id));
  }

  return NextResponse.json({ activity }, { status: 201 });
}
