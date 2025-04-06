import { cache } from "react";

import { and, desc, eq, like, notLike, sql } from "drizzle-orm";

import { cmsDb } from "~/lib/db";
import { tags } from "~/lib/db/schema";

export type Tag = {
  name: string;
  description: string;
};

export const getTags = cache((): Promise<Tag[]> => {
  return cmsDb
    .select({
      name: tags.name,
      description: tags.description,
    })
    .from(tags)
    .orderBy(tags.description);
});

export const getTechniqueTags = cache((): Promise<Tag[]> => {
  return cmsDb
    .select({
      name: tags.name,
      description: tags.description,
    })
    .from(tags)
    .where(eq(tags.isTechnique, true))
    .orderBy(tags.description);
});

export const getOiiYearTags = cache((): Promise<Tag[]> => {
  return cmsDb
    .select({
      name: tags.name,
      description: tags.description,
    })
    .from(tags)
    .where(and(eq(tags.isEvent, true), like(tags.name, "ioi20%")))
    .orderBy(desc(tags.name));
});

export const getOisYearTags = cache((): Promise<Tag[]> => {
  return cmsDb
    .select({
      name: tags.name,
      description: tags.description,
    })
    .from(tags)
    .where(and(eq(tags.isEvent, true), like(tags.name, "ois_%"), notLike(tags.name, "ois-%")))
    .orderBy(desc(sql`SUBSTRING(${tags.name} FROM 4)::int`));
});
