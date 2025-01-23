import { cache } from "react";

import { and, asc, desc, eq, like, sql } from "drizzle-orm";

import { db } from "~/lib/db";
import { tags, taskTags, tasks } from "~/lib/db/schema";

export type Tag = {
  name: string;
  description: string;
};

export const getTags = cache((): Promise<Tag[]> => {
  return db
    .select({
      name: tags.name,
      description: tags.description,
    })
    .from(tags)
    .orderBy(tags.description);
});

export const getTechniqueTags = cache((): Promise<Tag[]> => {
  return db
    .select({
      name: tags.name,
      description: tags.description,
    })
    .from(tags)
    .where(eq(tags.isTechnique, true))
    .orderBy(tags.description);
});

export const getYearTags = cache((): Promise<Tag[]> => {
  return db
    .select({
      name: tags.name,
      description: tags.description,
    })
    .from(tags)
    .where(and(eq(tags.isEvent, true), like(tags.name, "ioi20%")))
    .orderBy(tags.name);
});

export type TaskTag = {
  name: string;
  description: string;
  isEvent: boolean;
  canDelete: boolean;
};

export const getTaskTags = cache(
  (taskName: string, userId: number | undefined): Promise<TaskTag[]> => {
    return db
      .select({
        name: tags.name,
        description: tags.description,
        isEvent: tags.isEvent,
        canDelete:
          userId != null ? sql<boolean>`${eq(taskTags.addedBy, userId)}` : sql<boolean>`false`,
      })
      .from(tags)
      .innerJoin(taskTags, eq(taskTags.tagId, tags.id))
      .innerJoin(tasks, eq(tasks.id, taskTags.taskId))
      .where(eq(tasks.name, taskName))
      .orderBy(desc(tags.isEvent), asc(tags.description));
  },
);
