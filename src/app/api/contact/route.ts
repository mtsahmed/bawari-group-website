import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { contactFormSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // Honeypot tripped — pretend success so the bot doesn't learn anything.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const { name, email, company, message } = parsed.data;

  await db.insert(leads).values({
    contactName: name,
    companyName: company || name,
    email,
    notes: message,
    source: "contact_form",
    status: "new",
  });

  return NextResponse.json({ ok: true });
}
