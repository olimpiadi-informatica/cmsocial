import { cache } from "react";

import { and, eq } from "drizzle-orm";

import { terryDb } from "~/lib/db";
import { terryTasks, terryUserTasks } from "~/lib/db/schema-terry";

export type TerryTaskItem = {
  name: string;
  title: string;
  score?: number | null;
  maxScore: number;
};

export const getTerryTasks = cache((username?: string): Promise<TerryTaskItem[]> => {
  const taskQuery = terryDb
    .select({
      name: terryTasks.name,
      title: terryTasks.title,
      maxScore: terryTasks.maxScore,
      num: terryTasks.num,
    })
    .from(terryTasks)
    .orderBy(terryTasks.num);

  if (!username) {
    return taskQuery;
  }

  const tasksSq = taskQuery.as("tasks_sq");

  return terryDb
    .select({
      name: tasksSq.name,
      title: tasksSq.title,
      score: terryUserTasks.score,
      maxScore: tasksSq.maxScore,
    })
    .from(tasksSq)
    .leftJoin(
      terryUserTasks,
      and(eq(terryUserTasks.task, tasksSq.name), eq(terryUserTasks.token, username)),
    )
    .orderBy(tasksSq.num);
});
