import { cache } from "react";

import { and, eq } from "drizzle-orm";

import { type File, getFile } from "~/lib/api/file";
import { cmsDb } from "~/lib/db";
import {
  type RawSubmissionResultSubtask,
  type RawSubmissionResultTestcase,
  datasets,
  evaluations,
  files,
  participations,
  submissionResults,
  submissions,
  tasks,
  testcases,
} from "~/lib/db/schema-cms";
import { type Language, languageExtension } from "~/lib/language";

export type SubmissionResultTestcase = {
  idx: string;
  memory: number | null;
  outcome: "Correct" | "Partially correct" | "Not correct";
  text: string;
  time: number | null;
};

export type SubmissionResultSubtask = {
  idx?: number;
  score: number;
  maxScore: number;
  testcases: SubmissionResultTestcase[];
};

export type SubmissionResult = {
  id: number;
  timestamp: Date;
  language: string | null;
  timeLimit: number | null;
  memoryLimit: bigint | null;
  compilationOutcome: "ok" | "fail" | null;
  compilationTries: number | null;
  evaluationOutcome: "ok" | null;
  evaluationTries: number | null;
  compilationMemory: bigint | null;
  compilationTime: number | null;
  compilationStdout: string | null;
  compilationStderr: string | null;
  score: number | null;
  scoreDetails: SubmissionResultSubtask[] | null;
  evaluationsCount: number;
  testcaseCount: number;
};

export const getSubmission = cache(
  async (id: number, taskName: string, userId: number): Promise<SubmissionResult | undefined> => {
    const [submission] = await cmsDb
      .select({
        id: submissions.id,
        timestamp: submissions.timestamp,
        language: submissions.language,
        timeLimit: datasets.timeLimit,
        memoryLimit: datasets.memoryLimit,
        compilationOutcome: submissionResults.compilationOutcome,
        compilationTries: submissionResults.compilationTries,
        evaluationOutcome: submissionResults.evaluationOutcome,
        evaluationTries: submissionResults.evaluationTries,
        compilationMemory: submissionResults.compilationMemory,
        compilationTime: submissionResults.compilationTime,
        compilationStdout: submissionResults.compilationStdout,
        compilationStderr: submissionResults.compilationStderr,
        score: submissionResults.score,
        scoreDetails: submissionResults.scoreDetails,
        evaluationsCount: cmsDb.$count(
          evaluations,
          and(
            eq(evaluations.datasetId, tasks.activeDatasetId),
            eq(evaluations.submissionId, submissions.id),
          ),
        ),
        testcaseCount: cmsDb.$count(testcases, eq(testcases.datasetId, tasks.activeDatasetId)),
      })
      .from(submissions)
      .innerJoin(tasks, eq(tasks.id, submissions.taskId))
      .innerJoin(datasets, eq(datasets.id, tasks.activeDatasetId))
      .innerJoin(participations, eq(participations.id, submissions.participationId))
      .leftJoin(
        submissionResults,
        and(
          eq(submissionResults.submissionId, submissions.id),
          eq(submissionResults.datasetId, tasks.activeDatasetId),
        ),
      )
      .where(
        and(eq(submissions.id, id), eq(tasks.name, taskName), eq(participations.userId, userId)),
      );
    if (!submission) return;

    return {
      ...submission,
      scoreDetails: mapScoreDetails(submission.scoreDetails, submission.score ?? 0),
    };
  },
);

function mapScoreDetails(
  details: (typeof submissionResults.$inferSelect)["scoreDetails"],
  score: number,
): SubmissionResultSubtask[] | null {
  if (!details || details.length === 0) return null;

  if ("outcome" in details[0]) {
    return [
      {
        score: score,
        maxScore: 100,
        testcases: mapScoreDetailsTestcase(details as RawSubmissionResultTestcase[]),
      },
    ];
  }

  return (details as RawSubmissionResultSubtask[]).map(
    ({ testcases, score, score_fraction, max_score, ...subtask }) => ({
      ...subtask,
      score: score ?? score_fraction * max_score,
      maxScore: max_score,
      testcases: mapScoreDetailsTestcase(testcases),
    }),
  );
}

function mapScoreDetailsTestcase(
  testcases: RawSubmissionResultTestcase[],
): SubmissionResultTestcase[] {
  return testcases.map((testcase) => {
    let i = 1;
    return {
      idx: testcase.idx,
      memory: testcase.memory,
      outcome: testcase.outcome,
      text: testcase.text[0].replaceAll(/%./g, () => String(testcase.text[i++])),
      time: testcase.time,
    };
  });
}

export const getSubmissionFiles = cache((id: number, language: Language): Promise<File[]> => {
  return cmsDb
    .select({
      name: files.filename,
      digest: files.digest,
      url: getFile(files.filename, files.digest).mapWith((url: string) =>
        url.replace("%l", languageExtension(language)),
      ),
    })
    .from(files)
    .where(eq(files.submissionId, id))
    .orderBy(files.filename);
});
