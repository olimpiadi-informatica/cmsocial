import { drizzle as drizzleSqlite } from "drizzle-orm/libsql";
import { drizzle as drizzlePostgres } from "drizzle-orm/node-postgres";

export const cmsDb = drizzlePostgres(process.env.CMS_DATABASE_URL!, {
  logger: process.env.NODE_ENV === "development",
});
export const terryDb = drizzleSqlite(process.env.TERRY_DATABASE_URL!, {
  logger: process.env.NODE_ENV === "development",
});
