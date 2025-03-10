import { cache } from "react";

import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { and, asc, desc, eq, sql } from "drizzle-orm";

import { getAccessLevel } from "~/lib/api/permissions";
import { cmsDb } from "~/lib/db";
import { tasks } from "~/lib/db/schema-cms";
import { tags, taskTags } from "~/lib/db/schema-cmsocial";
import { AccessLevel } from "~/lib/permissions";

export type TaskTag = {
  name: string;
  description: string;
  isEvent: boolean;
  canDelete: boolean;
};

export const getTaskTags = cache(
  async (taskName: string, userId: number | undefined): Promise<TaskTag[]> => {
    const accessLevel = await getAccessLevel(userId);

    return cmsDb
      .select({
        name: tags.name,
        description: tags.description,
        isEvent: tags.isEvent,
        canDelete:
          accessLevel === AccessLevel.Admin
            ? sql<boolean>`true`
            : userId != null
              ? sql<boolean>`${eq(taskTags.addedBy, userId)}`
              : sql<boolean>`false`,
      })
      .from(tags)
      .innerJoin(taskTags, eq(taskTags.tagId, tags.id))
      .innerJoin(tasks, eq(tasks.id, taskTags.taskId))
      .where(eq(tasks.name, taskName))
      .orderBy(desc(tags.isEvent), asc(tags.description));
  },
);

export async function addTaskTag(
  userId: number,
  taskName: string,
  tagName: string,
): Promise<MessageDescriptor | undefined> {
  const accessLevel = await getAccessLevel(userId);
  if (accessLevel > AccessLevel.User) return msg`Non sei autorizzato`;

  await cmsDb.insert(taskTags).values({
    taskId: sql`(SELECT ${tasks.id} FROM ${tasks} WHERE ${eq(tasks.name, taskName)})`,
    tagId: sql`(SELECT ${tags.id} FROM ${tags} WHERE ${eq(tags.name, tagName)})`,
    addedBy: userId,
  });
}

export async function removeTaskTag(
  userId: number,
  taskName: string,
  tagName: string,
): Promise<MessageDescriptor | undefined> {
  const accessLevel = await getAccessLevel(userId);

  const deleted = await cmsDb
    .delete(taskTags)
    .where(
      and(
        eq(
          taskTags.taskId,
          sql`(SELECT ${tasks.id} FROM ${tasks} WHERE ${eq(tasks.name, taskName)})`,
        ),
        eq(taskTags.tagId, sql`(SELECT ${tags.id} FROM ${tags} WHERE ${eq(tags.name, tagName)})`),
        eq(taskTags.addedBy, userId).if(accessLevel !== AccessLevel.Admin),
      ),
    )
    .returning();

  if (deleted.length === 0) return msg`Tag non trovato`;
}
