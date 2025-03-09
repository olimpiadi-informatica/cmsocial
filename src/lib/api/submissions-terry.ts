import { cache } from "react";

import { fromUnixTime } from "date-fns";
import { and, desc, eq, sql } from "drizzle-orm";

import { terryDb } from "~/lib/db";
import { terrySources, terrySubmissions, terryTasks } from "~/lib/db/schema-terry";

export type TerrySubmission = {
  id: string;
  date: Date;
  score: number;
  maxScore: number;
  source: string;
};

export const getTerrySubmissions = cache(
  (taskName: string, username: string): Promise<TerrySubmission[]> => {
    return terryDb
      .select({
        id: terrySubmissions.id,
        date: sql`${terrySubmissions.date}`.mapWith(fromUnixTime),
        score: terrySubmissions.score,
        maxScore: terryTasks.maxScore,
        source: terrySources.path,
      })
      .from(terrySubmissions)
      .innerJoin(terryTasks, eq(terryTasks.name, terrySubmissions.task))
      .innerJoin(terrySources, eq(terrySources.id, terrySubmissions.source))
      .where(and(eq(terrySubmissions.task, taskName), eq(terrySubmissions.token, username)))
      .orderBy(desc(terrySubmissions.date));
  },
);
