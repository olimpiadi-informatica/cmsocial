import { cache } from "react";

import { and, desc, eq, like, notLike, sql } from "drizzle-orm";

import { cmsDb } from "~/lib/db";
import { tags } from "~/lib/db/schema";

export type Tag = {
  name: string;
  description: string;
};

export const getTags = cache((locale: string): Promise<Tag[]> => {
  return cmsDb
    .select({
      name: tags.name,
      description: sql<string>`${tags.translations} ->> ${locale}`,
    })
    .from(tags)
    .orderBy(sql<string>`${tags.translations} ->> ${locale}`);
});

export const getTechniqueTags = cache((locale: string): Promise<Tag[]> => {
  return cmsDb
    .select({
      name: tags.name,
      description: sql<string>`${tags.translations} ->> ${locale}`,
    })
    .from(tags)
    .where(eq(tags.isTechnique, true))
    .orderBy(sql<string>`${tags.translations} ->> ${locale}`);
});

export const getOiiYearTags = cache((locale: string): Promise<Tag[]> => {
  return cmsDb
    .select({
      name: tags.name,
      description: sql<string>`${tags.translations} ->> ${locale}`,
    })
    .from(tags)
    .where(and(eq(tags.isEvent, true), like(tags.name, "ioi20%")))
    .orderBy(desc(tags.name));
});

export const getOisYearTags = cache((locale: string): Promise<Tag[]> => {
  return cmsDb
    .select({
      name: tags.name,
      description: sql<string>`${tags.translations} ->> ${locale}`,
    })
    .from(tags)
    .where(and(eq(tags.isEvent, true), like(tags.name, "ois_%"), notLike(tags.name, "ois-%")))
    .orderBy(desc(sql`SUBSTRING(${tags.name} FROM 4)::int`));
});
