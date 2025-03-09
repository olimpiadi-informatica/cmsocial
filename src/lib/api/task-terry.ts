import { cache } from "react";

import { fromUnixTime } from "date-fns";
import { and, eq, sql } from "drizzle-orm";

import { terryDb } from "~/lib/db";
import { terryInputs, terryTasks, terryUserTasks } from "~/lib/db/schema-terry";

export type TerryTask = {
  name: string;
  title: string;
  maxScore: number;
  statementPath: string;
  submissionTimeout: number | null;
};

export const getTerryTask = cache(async (name: string): Promise<TerryTask | undefined> => {
  const [task] = await terryDb
    .select({
      name: terryTasks.name,
      title: terryTasks.title,
      maxScore: terryTasks.maxScore,
      statementPath: terryTasks.statementPath,
      submissionTimeout: terryTasks.submissionTimeout,
    })
    .from(terryTasks)
    .where(eq(terryTasks.name, name));
  return task;
});

export type TerryTaskInput = {
  id: string;
  path: string;
  date: Date;
};

export const getTerryTaskInput = cache(
  async (name: string, username: string): Promise<TerryTaskInput | undefined> => {
    const [input] = await terryDb
      .select({
        id: terryInputs.id,
        path: terryInputs.path,
        date: sql`${terryInputs.date}`.mapWith(fromUnixTime),
      })
      .from(terryUserTasks)
      .innerJoin(
        terryInputs,
        and(
          eq(terryInputs.task, terryUserTasks.task),
          eq(terryInputs.token, terryUserTasks.token),
          eq(terryInputs.attempt, terryUserTasks.currentAttempt),
        ),
      )
      .where(and(eq(terryUserTasks.task, name), eq(terryUserTasks.token, username)));
    return input;
  },
);
