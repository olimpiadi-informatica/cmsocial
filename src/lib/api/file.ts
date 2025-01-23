import { type SQL, sql } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core/columns";

export type File = {
  name: string;
  url: string;
};

export function getFile(name: PgColumn | string, digest: PgColumn): SQL<string> {
  return sql<string>`${process.env.NEXT_PUBLIC_TRAINING_API_URL} || '/files/' || ${digest} || '/' || ${name}`;
}
