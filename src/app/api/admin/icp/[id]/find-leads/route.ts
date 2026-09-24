import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { icps, leads } from "@/lib/db/schema";
import { getSessionUser } from "@/lib/supabase/server";
import { normalizeDomain, searchOrganizations } from "@/lib/apollo";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, { params }: Params) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const [icp] = await db.select().from(icps).where(eq(icps.id, id));
  if (!icp) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let organizations;
  try {
    organizations = await searchOrganizations({
      locations: icp.location ? [icp.location] : [],
      keywords: icp.keywords,
      employeeRangeMin: icp.employeeRangeMin ?? undefined,
      employeeRangeMax: icp.employeeRangeMax ?? undefined,
      perPage: 10,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Apollo search failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 },
    );
  }

  const existingLeads = await db
    .select({ website: leads.website })
    .from(leads);
  const existingDomains = new Set(
    existingLeads
      .map((row) => normalizeDomain(row.website))
      .filter((domain): domain is string => domain !== null),
  );

  let created = 0;
  let skippedDuplicates = 0;
  const seenInThisBatch = new Set<string>();

  for (const org of organizations) {
    const domain = normalizeDomain(org.website_url ?? org.primary_domain);

    if (domain && (existingDomains.has(domain) || seenInThisBatch.has(domain))) {
      skippedDuplicates += 1;
      continue;
    }

    await db.insert(leads).values({
      companyName: org.name,
      segment: icp.segment,
      status: "new",
      source: "apollo",
      website: org.website_url ?? org.primary_domain ?? undefined,
      phone: org.phone ?? undefined,
      linkedinUrl: org.linkedin_url ?? undefined,
      icpId: icp.id,
    });

    if (domain) seenInThisBatch.add(domain);
    created += 1;
  }

  return NextResponse.json({
    created,
    skippedDuplicates,
    totalReturned: organizations.length,
  });
}
