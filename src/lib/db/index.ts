import { drizzle as drizzleSqlite } from "drizzle-orm/libsql";
import { drizzle as drizzlePostgres } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export const cmsDb = drizzlePostgres(process.env.CMS_DATABASE_URL!);
export const terryDb = drizzleSqlite(process.env.TERRY_DATABASE_URL!);

// Dedicated pool for large object reads, so that streaming a file never competes
// with the rest of the application for connections.
export const filesDb = drizzlePostgres(
  new Pool({
    connectionString: process.env.CMS_DATABASE_URL!,
    max: 8,
    application_name: "files",
  }),
);
