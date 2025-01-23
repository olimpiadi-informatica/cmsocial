import { cache } from "react";

import { getScores as getTerryScores } from "@olinfo/terry-api";
import { and, desc, eq, inArray, sql } from "drizzle-orm";

import { algobadge } from "~/lib/algobadge";
import { db } from "~/lib/db";
import { participations, submissionResults, submissions, tasks, users } from "~/lib/db/schema";

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

export const getAlgobadgeScores = cache(
  async (username: string | undefined): Promise<AlgobadgeScores | undefined> => {
    if (!username) return;

    const [user] = await db
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
      scores: [
        ...training,
        ...terry.map((t) => ({
          taskName: t.name,
          taskTitle: t.title,
          score: t.score,
          maxScore: t.max_score,
          terry: true,
        })),
      ],
    };
  },
);
