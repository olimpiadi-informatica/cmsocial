import { cache } from "react";

import { and, desc, eq } from "drizzle-orm";

import { cmsDb } from "~/lib/db";
import { participations, submissionResults, submissions, tasks } from "~/lib/db/schema";

export type Submission = {
  id: number;
  timestamp: Date;
  language: string | null;
  compilationOutcome: "ok" | "fail" | null;
  compilationTries: number | null;
  evaluationOutcome: "ok" | null;
  evaluationTries: number | null;
  score: number | null;
};

export const getTaskSubmissions = cache(
  (taskName: string, userId: number): Promise<Submission[]> => {
    return cmsDb
      .select({
        id: submissions.id,
        timestamp: submissions.timestamp,
        language: submissions.language,
        compilationOutcome: submissionResults.compilationOutcome,
        compilationTries: submissionResults.compilationTries,
        evaluationOutcome: submissionResults.evaluationOutcome,
        evaluationTries: submissionResults.evaluationTries,
        score: submissionResults.score,
      })
      .from(submissions)
      .innerJoin(tasks, eq(tasks.id, submissions.taskId))
      .innerJoin(participations, eq(participations.id, submissions.participationId))
      .leftJoin(
        submissionResults,
        and(
          eq(submissionResults.submissionId, submissions.id),
          eq(submissionResults.datasetId, tasks.activeDatasetId),
        ),
      )
      .where(and(eq(tasks.name, taskName), eq(participations.userId, userId)))
      .orderBy(desc(submissions.timestamp));
  },
);
