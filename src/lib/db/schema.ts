import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const segmentEnum = pgEnum("segment", [
  "south_asian_diaspora",
  "afghan_central_asian_diaspora",
  "middle_eastern_turkish",
  "mainstream_german",
  "food_service_horeca",
  "private_label_b2b",
]);

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
]);

export const leadSourceEnum = pgEnum("lead_source", [
  "apollo",
  "manual",
  "contact_form",
]);

export const icps = pgTable("icps", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  segment: segmentEnum("segment").notNull(),
  keywords: text("keywords").array().notNull().default([]),
  location: varchar("location", { length: 255 }),
  employeeRangeMin: integer("employee_range_min"),
  employeeRangeMax: integer("employee_range_max"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  contactName: varchar("contact_name", { length: 255 }),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  // Nullable: contact-form submissions don't collect a segment — the
  // admin triages/assigns one manually. Manual and Apollo-sourced leads
  // always set this via leadCreateSchema/the ICP's own segment.
  segment: segmentEnum("segment"),
  status: leadStatusEnum("status").notNull().default("new"),
  source: leadSourceEnum("source").notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  website: varchar("website", { length: 500 }),
  address: text("address"),
  linkedinUrl: varchar("linkedin_url", { length: 500 }),
  notes: text("notes"),
  icpId: uuid("icp_id").references(() => icps.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const leadActivities = pgTable("lead_activities", {
  id: uuid("id").defaultRandom().primaryKey(),
  leadId: uuid("lead_id")
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),
  note: text("note").notNull(),
  statusAtTime: leadStatusEnum("status_at_time"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
