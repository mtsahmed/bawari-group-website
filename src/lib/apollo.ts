const APOLLO_SEARCH_URL = "https://api.apollo.io/api/v1/mixed_companies/search";

export type ApolloOrganization = {
  id: string;
  name: string;
  website_url: string | null;
  primary_domain: string | null;
  phone: string | null;
  linkedin_url: string | null;
  estimated_num_employees: number | null;
};

export type ApolloSearchParams = {
  locations: string[];
  keywords: string[];
  employeeRangeMin?: number;
  employeeRangeMax?: number;
  perPage?: number;
};

// Small, fixed fixture used when APOLLO_MOCK=true — lets the "Find Leads"
// flow (mapping, dedup, insert) be exercised end-to-end without spending
// real Apollo credits while iterating locally.
const MOCK_ORGANIZATIONS: ApolloOrganization[] = [
  {
    id: "mock-1",
    name: "Berlin Spice Grocers GmbH",
    website_url: "https://berlinspicegrocers.example",
    primary_domain: "berlinspicegrocers.example",
    phone: "+49 30 1234567",
    linkedin_url: "https://linkedin.com/company/berlin-spice-grocers",
    estimated_num_employees: 12,
  },
  {
    id: "mock-2",
    name: "Kreuzberg Kitchen Supply",
    website_url: "https://kreuzbergkitchen.example",
    primary_domain: "kreuzbergkitchen.example",
    phone: "+49 30 7654321",
    linkedin_url: "https://linkedin.com/company/kreuzberg-kitchen-supply",
    estimated_num_employees: 34,
  },
];

function buildRequestBody(params: ApolloSearchParams) {
  const body: Record<string, unknown> = { per_page: params.perPage ?? 10 };

  if (params.locations.length > 0) {
    body.organization_locations = params.locations;
  }
  if (params.keywords.length > 0) {
    body.q_organization_keyword_tags = params.keywords;
  }
  if (params.employeeRangeMin !== undefined || params.employeeRangeMax !== undefined) {
    const min = params.employeeRangeMin ?? 0;
    const max = params.employeeRangeMax ?? 1000000;
    body.organization_num_employees_ranges = [`${min},${max}`];
  }

  return body;
}

async function apolloRequest(body: Record<string, unknown>) {
  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) {
    throw new Error("APOLLO_API_KEY is not set");
  }

  const res = await fetch(APOLLO_SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Apollo API error (${res.status}): ${text.slice(0, 300)}`);
  }

  return res.json();
}

export async function searchOrganizations(
  params: ApolloSearchParams,
): Promise<ApolloOrganization[]> {
  if (process.env.APOLLO_MOCK === "true") {
    return MOCK_ORGANIZATIONS.slice(0, params.perPage ?? 10);
  }

  const data = await apolloRequest(buildRequestBody(params));
  return (data.organizations ?? data.accounts ?? []) as ApolloOrganization[];
}

// Always hits the real API (ignores APOLLO_MOCK) — used by the
// settings-page "test connection" button, where the whole point is to
// confirm the real key works.
export async function testApolloConnection(): Promise<{
  ok: boolean;
  message?: string;
}> {
  try {
    await apolloRequest({
      per_page: 1,
      organization_locations: ["Berlin, Germany"],
    });
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export function normalizeDomain(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const withProtocol = url.startsWith("http") ? url : `https://${url}`;
    const host = new URL(withProtocol).hostname.toLowerCase();
    return host.startsWith("www.") ? host.slice(4) : host;
  } catch {
    return url.toLowerCase().replace(/^www\./, "");
  }
}
