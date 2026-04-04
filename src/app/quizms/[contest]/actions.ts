"use server";

import { headers } from "next/headers";

import { msg } from "@lingui/core/macro";

import {
  deleteQuizmsSession,
  getQuizmsSession,
  type QuizmsSession,
  setQuizmsSessionAnswers,
  startQuizmsSession,
  submitQuizmsSession,
} from "~/lib/api/quizms";
import { getUser } from "~/lib/api/user";
import { auth } from "~/lib/auth";
import type { User } from "~/lib/auth/types";
import { loadLocale } from "~/lib/locale";
import { logger } from "~/lib/logger";
import { getSessionUser } from "~/lib/user";

import type { QuizmsInMessage, QuizmsOutMessage, QuizmsStudent } from "./utils";

async function getQuizmsStudent(
  user: User,
  contestId: string,
  sessionPromise: Promise<QuizmsSession | undefined>,
): Promise<QuizmsStudent> {
  const [cmsUser, session] = await Promise.all([getUser(user.username), sessionPromise]);

  return {
    id: user.id,
    userData: {
      name: cmsUser!.firstName,
      surname: cmsUser!.lastName,
    },
    contestId,
    variantId: session?.quizmsVariantId ?? undefined,
    answers: session?.answers ?? undefined,
    score: session?.score ?? undefined,
    participationWindow:
      session?.startedAt && session?.finishedAt
        ? { start: session.startedAt, end: session.finishedAt }
        : undefined,
  };
}

export async function processQuizmsMessage(
  message: Exclude<QuizmsInMessage, { type: "getTitle" | "logout" }>,
): Promise<QuizmsOutMessage> {
  const i18n = await loadLocale();

  const user = await getSessionUser();
  if (!user) {
    return { success: true, messageId: message.messageId, data: null };
  }

  const ok = async (data: Promise<QuizmsSession | undefined>): Promise<QuizmsOutMessage> => ({
    success: true,
    messageId: message.messageId,
    data: await getQuizmsStudent(user, message.contestId, data),
  });

  try {
    switch (message.type) {
      case "getStudent":
        return await ok(getQuizmsSession(user.id, message.contestId));
      case "start":
        return await ok(
          startQuizmsSession(
            user.id,
            message.contestId,
            message.variantId,
            message.duration,
            message.score,
            message.maxScore,
          ),
        );
      case "setAnswers":
        return await ok(
          setQuizmsSessionAnswers(
            user.id,
            message.contestId,
            message.answers,
            message.score,
            message.maxScore,
          ),
        );
      case "submit":
        return await ok(submitQuizmsSession(user.id, message.contestId));
      case "reset":
        return await ok(deleteQuizmsSession(user.id, message.contestId));
    }
  } catch (err) {
    logger.error("Error processing quizms message", err);
    return {
      success: false,
      messageId: message.messageId,
      error: i18n._(msg`Errore sconosciuto`),
    };
  }
}

export async function logout(messageId: string): Promise<QuizmsOutMessage> {
  const i18n = await loadLocale();

  try {
    await auth.api.signOut({ headers: await headers() });
    return { success: true, messageId, data: null };
  } catch {
    return { success: false, messageId, error: i18n._(msg`Errore sconosciuto`) };
  }
}
