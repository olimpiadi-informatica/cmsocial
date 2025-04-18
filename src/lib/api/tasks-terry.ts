import { cache } from "react";

import { and, eq, exists, sql } from "drizzle-orm";

import { terryDb } from "~/lib/db";
import { terrySubmissions, terryTasks, terryUserTasks } from "~/lib/db/schema-terry";

export type TerryTaskItem = {
  name: string;
  title: string;
  score: number | null;
  maxScore: number;
};

export const getTerryTasks = cache((username?: string): Promise<TerryTaskItem[]> => {
  const query = terryDb
    .select({
      name: terryTasks.name,
      title: terryTasks.title,
      score: username ? terryUserTasks.score : sql<null>`NULL`,
      maxScore: terryTasks.maxScore,
      num: terryTasks.num,
    })
    .from(terryTasks)
    .orderBy(terryTasks.num);

  if (username) {
    return query.leftJoin(
      terryUserTasks,
      and(
        eq(terryUserTasks.task, terryTasks.name),
        eq(terryUserTasks.token, username),
        exists(
          terryDb
            .select()
            .from(terrySubmissions)
            .where(
              and(eq(terrySubmissions.task, terryTasks.name), eq(terrySubmissions.token, username)),
            ),
        ),
      ),
    );
  }

  return query;
});
