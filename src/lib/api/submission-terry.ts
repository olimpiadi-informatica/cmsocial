import { cache } from "react";

import { fromUnixTime } from "date-fns";
import { and, eq, sql } from "drizzle-orm";

import { terryDb } from "~/lib/db";
import {
  terryInputs,
  terryOutputs,
  terrySources,
  terrySubmissions,
  terryTasks,
} from "~/lib/db/schema-terry";

export type TerryCase = {
  correct: boolean;
  status: string;
  message?: string;
};

export type TerryAlert = {
  message: string;
  severity: "warning" | "danger" | "success";
};

export type TerrySubmissionDetail = {
  date: Date;
  score: number;
  maxScore: number;
  source: string;
  input: string;
  output: string;
  alerts: TerryAlert[];
  cases: TerryCase[];
};

type RawTerrySubmissionResult = {
  score: number;
  validation: {
    cases: {
      status: string;
      message?: string;
    }[];
    alerts: TerryAlert[];
  };
  feedback: {
    cases: {
      correct: boolean;
      message?: string;
    }[];
    alerts: TerryAlert[];
  };
};

export const getTerrySubmission = cache(
  async (id: string, username: string): Promise<TerrySubmissionDetail | undefined> => {
    const [submission] = await terryDb
      .select({
        date: sql`${terrySubmissions.date}`.mapWith(fromUnixTime),
        score: terrySubmissions.score,
        maxScore: terryTasks.maxScore,
        source: terrySources.path,
        input: terryInputs.path,
        output: terryOutputs.path,
        result: terryOutputs.result,
      })
      .from(terrySubmissions)
      .innerJoin(terryTasks, eq(terryTasks.name, terrySubmissions.task))
      .innerJoin(terrySources, eq(terrySources.id, terrySubmissions.source))
      .innerJoin(terryInputs, eq(terryInputs.id, terrySubmissions.input))
      .innerJoin(terryOutputs, eq(terryOutputs.id, terrySubmissions.output))
      .where(and(eq(terrySubmissions.id, id), eq(terrySubmissions.token, username)));
    if (!submission) return;

    const result: RawTerrySubmissionResult = JSON.parse(submission.result);
    const cases = result.feedback.cases.map((c, i) => {
      const output = result.validation.cases[i];
      return {
        correct: c.correct,
        status: output.status,
        message: c.message || output.message,
      };
    });

    return {
      ...submission,
      alerts: [...result.feedback.alerts, ...result.validation.alerts],
      cases,
    };
  },
);
