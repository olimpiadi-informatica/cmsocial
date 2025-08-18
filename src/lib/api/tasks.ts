import { cache } from "react";

import {
  and,
  asc,
  count,
  countDistinct,
  desc,
  eq,
  exists,
  gt,
  gte,
  ilike,
  inArray,
  isNull,
  lt,
  ne,
  or,
  type SQL,
  sql,
} from "drizzle-orm";

import { cmsDb } from "~/lib/db";
import {
  participations,
  socialTasks,
  submissions,
  tags,
  taskScores,
  tasks,
  taskTags,
} from "~/lib/db/schema";

export type TaskListOptions = {
  search: string | null | undefined;
  tags: string[] | null | undefined;
  order: string | null | undefined;
  unsolved: boolean | undefined;
  minDiff: number | null | undefined;
  maxDiff: number | null | undefined;
};

const scoreSq = cmsDb
  .select({
    taskId: taskScores.taskId,
    userId: participations.userId,
    score: taskScores.score,
  })
  .from(taskScores)
  .innerJoin(participations, eq(participations.id, taskScores.participationId))
  .as("score_sq");

function getFilter(userId: number | undefined, options: TaskListOptions): SQL | undefined {
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
  if (userId && options.unsolved) {
    filter.push(or(isNull(scoreSq.score), ne(scoreSq.score, 100)));
  }
  if (options.minDiff != null && Number.isFinite(options.minDiff)) {
    filter.push(gte(socialTasks.scoreMultiplier, options.minDiff));
  }
  if (options.maxDiff != null && Number.isFinite(options.maxDiff)) {
    filter.push(lt(socialTasks.scoreMultiplier, options.maxDiff));
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
  if (options.order === "trending") {
    order.push(
      desc(
        cmsDb
          .select({ c: countDistinct(submissions.participationId) })
          .from(submissions)
          .where(
            and(
              eq(submissions.taskId, tasks.id),
              gt(submissions.timestamp, sql`NOW() - INTERVAL '2 week'`),
            ),
          ),
      ),
    );
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
      .orderBy(...getOrder(options))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    if (userId) {
      return query
        .leftJoin(scoreSq, and(eq(scoreSq.taskId, tasks.id), eq(scoreSq.userId, userId)))
        .where(getFilter(userId, options));
    }

    return query.where(getFilter(userId, options));
  },
);

export const getTaskCount = cache(
  async (options: TaskListOptions, userId: number | undefined): Promise<number> => {
    const query = cmsDb
      .select({ count: count() })
      .from(tasks)
      .innerJoin(socialTasks, eq(socialTasks.id, tasks.id));

    if (userId && options.unsolved) {
      const [res] = await query
        .leftJoin(scoreSq, and(eq(scoreSq.taskId, tasks.id), eq(scoreSq.userId, userId)))
        .where(getFilter(userId, options));
      return res.count;
    }

    const [res] = await query.where(getFilter(userId, options));
    return res.count;
  },
);
