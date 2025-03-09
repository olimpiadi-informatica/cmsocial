import { cache } from "react";

import { and, eq, like } from "drizzle-orm";

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

export const getYearTags = cache((): Promise<Tag[]> => {
  return cmsDb
    .select({
      name: tags.name,
      description: tags.description,
    })
    .from(tags)
    .where(and(eq(tags.isEvent, true), like(tags.name, "ioi20%")))
    .orderBy(tags.name);
});
