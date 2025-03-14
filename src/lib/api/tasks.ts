import { cache } from "react";

import {
  type SQL,
  and,
  asc,
  count,
  desc,
  eq,
  exists,
  ilike,
  inArray,
  or,
  lt,
  sql,
} from "drizzle-orm";

import { cmsDb } from "~/lib/db";
import { socialTasks, tags, taskScores, taskTags, tasks, participations } from "~/lib/db/schema";

export type TaskListOptions = {
  search: string | null | undefined;
  tags: string[] | null | undefined;
  order: "hardest" | "easiest" | null | undefined;
  unsolved: boolean | undefined;
};

function getFilter(options: TaskListOptions) {
  const filter: (SQL | undefined)[] = [eq(tasks.contestId, Number(process.env.CMS_CONTEST_ID))];
  if (options.search) {
    const like = `%${options.search}%`;
    filter.push(or(ilike(tasks.name, like), ilike(tasks.title, like)));
  }
  if (options.tags?.length) {
    filter.push(
      exists(
        cmsDb
          .select({
            taskId: taskTags.taskId,
            count: count(),
          })
          .from(taskTags)
          .innerJoin(tags, eq(tags.id, taskTags.tagId))
          .where(and(eq(taskTags.taskId, tasks.id), inArray(tags.name, options.tags)))
          .groupBy(taskTags.taskId)
          .having(({ count }) => eq(count, options.tags!.length)),
      ),
    );
  }
  return and(...filter);
}

function getOrder(options: TaskListOptions) {
  const order = [];
  if (options.order === "hardest") {
    order.push(desc(socialTasks.scoreMultiplier), asc(socialTasks.correctUserCount));
  }
  if (options.order === "easiest") {
    order.push(asc(socialTasks.scoreMultiplier), desc(socialTasks.correctUserCount));
  }
  order.push(desc(socialTasks.id));
  return order;
}

export type TaskItem = {
  id: number;
  name: string;
  title: string;
  scoreMultiplier: number;
  score: number | null;
};

export const getTaskList = cache(
  (
    options: TaskListOptions,
    userId: number | undefined,
    page: number,
    pageSize: number,
  ): Promise<TaskItem[]> => {
    if (pageSize > 100) {
      throw new Error("pageSize must be less than or equal to 100");
    }

    const scoreSq = cmsDb
      .select({
        taskId: taskScores.taskId,
        userId: participations.userId,
        score: taskScores.score,
      })
      .from(taskScores)
      .innerJoin(participations, eq(participations.id, taskScores.participationId))
      .as("score_sq");

    const query = cmsDb
      .select({
        id: tasks.id,
        name: tasks.name,
        title: tasks.title,
        scoreMultiplier: socialTasks.scoreMultiplier,
        score: userId ? scoreSq.score : sql<null>`NULL`,
      })
      .from(tasks)
      .innerJoin(socialTasks, eq(socialTasks.id, tasks.id))
      .where(getFilter(options))
      .orderBy(...getOrder(options))
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .$dynamic();

    if (userId) {
      return query
        .leftJoin(scoreSq, eq(scoreSq.taskId, tasks.id))
        .where(and(eq(scoreSq.userId, userId), lt(scoreSq.score, 100).if(options.unsolved)));
    }

    return query;
  },
);

export const getTaskCount = cache(
  (options: TaskListOptions, userId: number | undefined): Promise<number> => {
    const scoreSq = cmsDb
      .select({
        taskId: taskScores.taskId,
        userId: participations.userId,
        score: taskScores.score,
      })
      .from(taskScores)
      .innerJoin(participations, eq(participations.id, taskScores.participationId))
      .as("score_sq");

    const query = cmsDb.select().from(tasks).where(getFilter(options)).$dynamic();

    if (userId && options.unsolved) {
      return cmsDb.$count(
        query
          .leftJoin(scoreSq, eq(scoreSq.taskId, tasks.id))
          .where(and(eq(scoreSq.userId, userId), lt(scoreSq.score, 100))),
      );
    }

    return cmsDb.$count(query);
  },
);
