import { cache } from "react";

import { and, eq, sql } from "drizzle-orm";

import { terryDb } from "~/lib/db";
import { terryTasks, terryUserTasks } from "~/lib/db/schema-terry";

export type TerryTaskItem = {
  name: string;
  title: string;
  score: number | null;
  maxScore: number;
};

export const getTerryTasks = cache((username?: string): Promise<TerryTaskItem[]> => {
  return terryDb
    .select({
      name: terryTasks.name,
      title: terryTasks.title,
      score: terryUserTasks.score,
      maxScore: terryTasks.maxScore,
      num: terryTasks.num,
    })
    .from(terryTasks)
    .leftJoin(
      terryUserTasks,
      username
        ? and(eq(terryUserTasks.task, terryTasks.name), eq(terryUserTasks.token, username))
        : sql`FALSE`,
    )
    .orderBy(terryTasks.num);
});
