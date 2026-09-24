import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// `prepare: false` is required for Supabase's pooled (Supavisor,
// transaction-mode) connection string, which does not support
// server-side prepared statements.
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
