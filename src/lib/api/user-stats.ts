import { cache } from "react";

import { TZDate } from "@date-fns/tz";
import { formatISO, fromUnixTime, getUnixTime, parseISO } from "date-fns";
import { and, count, eq, gte, lt, sql, sum } from "drizzle-orm";

import { cmsDb, terryDb } from "~/lib/db";
import { evaluations, participations, submissions, tasks } from "~/lib/db/schema-cms";
import { taskScores } from "~/lib/db/schema-cmsocial";
import { terrySubmissions, terryTasks, terryUserTasks } from "~/lib/db/schema-terry";

export const getSolvedCount = cache(async (userId: number, username: string): Promise<number> => {
  const [trainingSolved, terrySolved] = await Promise.all([
    getTrainingSolved(userId),
    getTerrySolved(username),
  ]);

  return trainingSolved + terrySolved;
});

async function getTrainingSolved(userId: number) {
  const [solved] = await cmsDb
    .select({ count: count() })
    .from(taskScores)
    .innerJoin(tasks, eq(tasks.id, taskScores.taskId))
    .innerJoin(participations, eq(participations.id, taskScores.participationId))
    .where(
      and(
        eq(taskScores.score, 100),
        eq(tasks.contestId, Number(process.env.CMS_CONTEST_ID)),
        eq(participations.userId, userId),
      ),
    );
  return solved.count;
}

async function getTerrySolved(username: string) {
  const [solved] = await terryDb
    .select({ count: count() })
    .from(terryUserTasks)
    .innerJoin(terryTasks, eq(terryTasks.name, terryUserTasks.task))
    .where(and(eq(terryUserTasks.score, terryTasks.maxScore), eq(terryUserTasks.token, username)));
  return solved.count;
}

export const getSubmissionCount = cache(
  async (userId: number, username: string): Promise<number> => {
    const [trainingSubmissions, terrySubmissions] = await Promise.all([
      getTrainingSubmissions(userId),
      getTerrySubmissions(username),
    ]);

    return trainingSubmissions + terrySubmissions;
  },
);

async function getTrainingSubmissions(userId: number) {
  const [submissionCount] = await cmsDb
    .select({ count: count() })
    .from(submissions)
    .innerJoin(participations, eq(participations.id, submissions.participationId))
    .where(eq(participations.userId, userId));
  return submissionCount.count;
}

function getTerrySubmissions(username: string) {
  return terryDb.$count(terrySubmissions, eq(terrySubmissions.token, username));
}

export const getSubmissionCountByDate = cache(
  async (
    userId: number,
    username: string,
    from: Date,
    to: Date,
    timezone: string,
  ): Promise<Record<string, number>> => {
    const [trainingDates, terryDates] = await Promise.all([
      getTrainingSubmissionCountByDate(userId, from, to, timezone),
      getTerrySubmissionDates(username, from, to),
    ]);
    const dates: Record<string, number> = {};
    for (const date of [...trainingDates, ...terryDates]) {
      const isoDate = formatISO(new TZDate(date.date, timezone), { representation: "date" });
      dates[isoDate] ??= 0;
      dates[isoDate] += date.count;
    }
    return dates;
  },
);

function getTrainingSubmissionCountByDate(userId: number, from: Date, to: Date, timezone: string) {
  return cmsDb
    .select({
      date: sql`DATE_TRUNC('day', ${submissions.timestamp}, ${timezone})`.mapWith(parseISO),
      count: count(),
    })
    .from(submissions)
    .innerJoin(participations, eq(participations.id, submissions.participationId))
    .where(
      and(
        eq(participations.userId, userId),
        gte(submissions.timestamp, from),
        lt(submissions.timestamp, to),
      ),
    )
    .groupBy(sql`1`);
}

function getTerrySubmissionDates(username: string, from: Date, to: Date) {
  return terryDb
    .select({
      date: sql`${terrySubmissions.date}`.mapWith(fromUnixTime),
      count: sql<number>`1`,
    })
    .from(terrySubmissions)
    .where(
      and(
        eq(terrySubmissions.token, username),
        gte(terrySubmissions.date, getUnixTime(from)),
        lt(terrySubmissions.date, getUnixTime(to)),
      ),
    );
}

export const getTotalEvaluationTime = cache(async (userId: number): Promise<number> => {
  const [time] = await cmsDb
    .select({ time: sum(evaluations.executionTime) })
    .from(evaluations)
    .innerJoin(submissions, eq(submissions.id, evaluations.submissionId))
    .innerJoin(participations, eq(participations.id, submissions.participationId))
    .where(eq(participations.userId, userId));
  return Number(time.time) ?? 0;
});
