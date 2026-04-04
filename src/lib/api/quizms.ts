import { addMinutes, isPast, subSeconds } from "date-fns";
import { and, eq, like } from "drizzle-orm";
import { keyBy } from "lodash-es";
import z from "zod";

import { cmsDb } from "~/lib/db";
import { quizmsSession } from "~/lib/db/schema-cmsocial";

export type QuizmsSession = {
  userId: string;
  quizmsContestId: string;
  quizmsVariantId: string | null;
  answers: Record<string, any> | null;
  score: number | null;
  maxScore: number | null;
  startedAt: Date | null;
  finishedAt: Date | null;
};

export async function getQuizmsSession(
  userId: string,
  contestId: string,
): Promise<QuizmsSession | undefined> {
  const result = await cmsDb
    .select()
    .from(quizmsSession)
    .where(and(eq(quizmsSession.userId, userId), eq(quizmsSession.quizmsContestId, contestId)));
  return result[0];
}

export async function startQuizmsSession(
  userId: string,
  contestId: string,
  variantId: string,
  duration: number,
  score: number,
  maxScore: number,
): Promise<QuizmsSession> {
  const now = new Date();
  const result = await cmsDb
    .insert(quizmsSession)
    .values({
      userId,
      quizmsContestId: contestId,
      quizmsVariantId: variantId,
      startedAt: subSeconds(now, 2),
      finishedAt: addMinutes(now, duration),
      score,
      maxScore,
    })
    .returning();
  return result[0];
}

export async function setQuizmsSessionAnswers(
  userId: string,
  contestId: string,
  answers: QuizmsSession["answers"],
  score: QuizmsSession["score"],
  maxScore: QuizmsSession["maxScore"],
): Promise<QuizmsSession> {
  const result = await cmsDb
    .update(quizmsSession)
    .set({ answers, score, maxScore })
    .where(and(eq(quizmsSession.userId, userId), eq(quizmsSession.quizmsContestId, contestId)))
    .returning();
  return result[0];
}

export async function submitQuizmsSession(
  userId: string,
  contestId: string,
): Promise<QuizmsSession> {
  const result = await cmsDb
    .update(quizmsSession)
    .set({ finishedAt: new Date() })
    .where(and(eq(quizmsSession.userId, userId), eq(quizmsSession.quizmsContestId, contestId)))
    .returning();
  return result[0];
}

export async function deleteQuizmsSession(userId: string, contestId: string): Promise<undefined> {
  await cmsDb
    .delete(quizmsSession)
    .where(and(eq(quizmsSession.userId, userId), eq(quizmsSession.quizmsContestId, contestId)))
    .returning();
}

const contestSchema = z
  .object({
    id: z.string(),
    name: z.string(),
  })
  .array();

export type QuizmsContest = {
  id: string;
  name: string;
  score?: number | null;
  maxScore?: number | null;
  ended?: boolean | null;
};

export async function getQuizmsContests(
  userId: string | undefined,
  prefix: string,
): Promise<QuizmsContest[]> {
  const resp = await fetch(`${process.env.QUIZMS_URL}/contests.json`);
  if (!resp.ok) throw new Error((await resp.text()) ?? resp.statusText);
  const contests = contestSchema.parse(await resp.json()).filter((c) => c.id.startsWith(prefix));
  if (!userId) {
    return contests;
  }

  const contestSessions: Record<string, QuizmsSession> = keyBy(
    await cmsDb
      .select()
      .from(quizmsSession)
      .where(
        and(eq(quizmsSession.userId, userId), like(quizmsSession.quizmsContestId, `${prefix}%`)),
      ),
    "quizmsContestId",
  );

  return contests.map((c) => {
    const session = contestSessions[c.id];
    return {
      ...c,
      score: session?.score,
      maxScore: session?.maxScore,
      ended: session?.finishedAt && isPast(session.finishedAt),
    };
  });
}
