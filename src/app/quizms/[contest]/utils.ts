import { z } from "zod";

import type { QuizmsSession } from "~/lib/api/quizms";

export type QuizmsStudent = {
  id: string;
  userData: {
    name: string;
    surname: string;
  };
  contestId: string;
  variantId?: string;
  answers?: QuizmsSession["answers"];
  score?: QuizmsSession["score"];
  participationWindow?: {
    start: Date;
    end: Date;
  };
};

export const quizmsInMessageSchema = z.discriminatedUnion("type", [
  z.strictObject({
    type: z.enum(["getTitle", "logout"]),
    messageId: z.string(),
  }),
  z.strictObject({
    type: z.enum(["getStudent", "submit", "reset"]),
    messageId: z.string(),
    contestId: z.string(),
  }),
  z.strictObject({
    type: z.literal("start"),
    messageId: z.string(),
    contestId: z.string(),
    variantId: z.string(),
    duration: z.number(),
    score: z.number().optional().default(0), // TODO: remove optional
    maxScore: z.number(),
  }),
  z.strictObject({
    type: z.literal("setAnswers"),
    messageId: z.string(),
    contestId: z.string(),
    answers: z.record(z.string(), z.any()),
    score: z.number(),
    maxScore: z.number(),
  }),
]);

export type QuizmsInMessage = z.infer<typeof quizmsInMessageSchema>;

export type QuizmsOutMessage =
  | {
      success: true;
      messageId: string;
      data: QuizmsStudent | null;
    }
  | {
      success: false;
      messageId: string;
      error: string;
    };
