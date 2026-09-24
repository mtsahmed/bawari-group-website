import { z } from "zod";

export const ALL_SEGMENTS = [
  "south_asian_diaspora",
  "afghan_central_asian_diaspora",
  "middle_eastern_turkish",
  "mainstream_german",
  "food_service_horeca",
  "private_label_b2b",
] as const;

// Apollo.io only has B2B company/contact data — automated lead-sourcing
// (ICPs) is structurally restricted to these two segments. See PROJECT.md.
export const B2B_SEGMENTS = ["food_service_horeca", "private_label_b2b"] as const;

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "meeting",
  "qualified",
  "won",
  "lost",
] as const;

export const LEAD_SOURCES = ["apollo", "manual", "contact_form"] as const;

const optionalString = (max: number) =>
  z
    .string()
    .max(max)
    .optional()
    .transform((v) => (v === "" ? undefined : v));

export const leadCreateSchema = z.object({
  companyName: z.string().min(1).max(255),
  contactName: optionalString(255),
  segment: z.enum(ALL_SEGMENTS),
  email: z.string().email().max(255).optional().or(z.literal("")),
  phone: optionalString(50),
  website: optionalString(500),
  address: optionalString(2000),
  linkedinUrl: optionalString(500),
  notes: optionalString(5000),
});

export const leadUpdateSchema = leadCreateSchema.partial().extend({
  status: z.enum(LEAD_STATUSES).optional(),
});

export const leadActivitySchema = z.object({
  note: z.string().min(1).max(5000),
  statusAtTime: z.enum(LEAD_STATUSES).optional(),
});

export const icpCreateSchema = z.object({
  name: z.string().min(1).max(255),
  segment: z.enum(B2B_SEGMENTS),
  keywords: z.array(z.string().min(1).max(100)).max(20).default([]),
  location: optionalString(255),
  employeeRangeMin: z.number().int().min(0).optional(),
  employeeRangeMax: z.number().int().min(0).optional(),
  notes: optionalString(5000),
});

export const icpUpdateSchema = icpCreateSchema.partial();

export const contactFormSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
  company: optionalString(255),
  message: z.string().min(1).max(5000),
  // Honeypot: a hidden field real users never fill in. Bots that
  // populate every field will trip this; the route silently no-ops.
  website: optionalString(255),
});
