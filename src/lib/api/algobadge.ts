import { and, desc, eq, inArray, max, sql } from "drizzle-orm";
import { cache } from "react";

import { algobadge } from "~/lib/algobadge";
import { cmsDb, terryDb } from "~/lib/db";
import { participations, submissionResults, submissions, tasks, users } from "~/lib/db/schema";
import { terrySubmissions, terryTasks } from "~/lib/db/schema-terry";

export type AlgobadgeScore = {
  taskName: string;
  taskTitle: string;
  score: number | null;
  maxScore: number;
  terry: boolean;
};

export type AlgobadgeScores = {
  username: string;
  name: string;
  scores: AlgobadgeScore[];
};

const trainingTaskNames = Object.values(algobadge)
  .flatMap((category) => category.tasks)
  .filter((task) => !task.terry)
  .map((task) => task.name);

const terryTaskNames = Object.values(algobadge)
  .flatMap((category) => category.tasks)
  .filter((task) => task.terry)
  .map((task) => task.name);

function getTrainingScores(userId: number): Promise<AlgobadgeScore[]> {
  return cmsDb
    .selectDistinctOn([submissions.taskId], {
      taskName: tasks.name,
      taskTitle: tasks.title,
      score: submissionResults.score,
      maxScore: sql<number>`100`,
      terry: sql<boolean>`FALSE`,
    })
    .from(submissions)
    .innerJoin(tasks, eq(tasks.id, submissions.taskId))
    .innerJoin(participations, eq(participations.id, submissions.participationId))
    .innerJoin(
      submissionResults,
      and(
        eq(submissionResults.submissionId, submissions.id),
        eq(submissionResults.datasetId, tasks.activeDatasetId),
      ),
    )
    .where(and(eq(participations.userId, userId), inArray(tasks.name, trainingTaskNames)))
    .orderBy(submissions.taskId, desc(submissions.timestamp));
}

function getTerryScores(username: string): Promise<AlgobadgeScore[]> {
  const lastSubmissionSq = terryDb
    .select({
      task: terrySubmissions.task,
      date: max(terrySubmissions.date).as("last_date"),
    })
    .from(terrySubmissions)
    .where(
      and(eq(terrySubmissions.token, username), inArray(terrySubmissions.task, terryTaskNames)),
    )
    .groupBy(terrySubmissions.task)
    .as("last_submission_sq");

  return terryDb
    .select({
      taskName: terryTasks.name,
      taskTitle: terryTasks.title,
      score: terrySubmissions.score,
      maxScore: terryTasks.maxScore,
      terry: sql`1`.mapWith(Boolean),
    })
    .from(terryTasks)
    .innerJoin(lastSubmissionSq, eq(lastSubmissionSq.task, terryTasks.name))
    .innerJoin(
      terrySubmissions,
      and(
        eq(terrySubmissions.task, lastSubmissionSq.task),
        eq(terrySubmissions.date, lastSubmissionSq.date),
      ),
    );
}

export const getAlgobadgeScores = cache(
  async (username: string | undefined): Promise<AlgobadgeScores | undefined> => {
    if (!username) return;

    const [user] = await cmsDb
      .select({
        id: users.id,
        username: users.username,
        name: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
      })
      .from(users)
      .where(eq(users.username, username));
    if (!user) return;

    const [training, terry] = await Promise.all([
      getTrainingScores(user.id),
      getTerryScores(username),
    ]);

    return {
      username: user.username,
      name: user.name,
      scores: [...training, ...terry],
    };
  },
);
