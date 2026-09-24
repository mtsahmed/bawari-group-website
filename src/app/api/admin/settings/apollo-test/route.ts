import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/supabase/server";
import { testApolloConnection } from "@/lib/apollo";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.APOLLO_API_KEY) {
    return NextResponse.json({ ok: false, message: "APOLLO_API_KEY is not set" });
  }

  const result = await testApolloConnection();
  return NextResponse.json(result);
}
