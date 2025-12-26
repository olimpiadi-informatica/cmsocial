import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { and, count, eq, gt, sql } from "drizzle-orm";
import { isString } from "lodash-es";

import { cmsDb } from "~/lib/db";
import { files, participations, submissions, tasks } from "~/lib/db/schema-cms";
import { logger } from "~/lib/logger";
import { getSessionUser } from "~/lib/user";

import { sendSubmission } from "./evaluation";
import { saveFile } from "./file";
import { getTask, getTaskLanguages } from "./task";

export async function submit(
  taskName: string,
  language: string | null,
  formData: FormData,
): Promise<
  { submissionId: number; error?: never } | { submissionId?: never; error: MessageDescriptor }
> {
  const user = await getSessionUser();
  if (!user) return { error: msg`Utente non autenticato` };

  const task = await getTask(taskName);
  if (!task) return { error: msg`Task non trovato` };

  if (await checkPastSubmissions(taskName, user.cmsId)) {
    return { error: msg`Sottoposizioni troppo frequenti` };
  }

  if (task.taskType !== "OutputOnly") {
    if (!language) return { error: msg`Linguaggio mancante` };

    const allowedLanguages = await getTaskLanguages(taskName);
    if (!Object.keys(allowedLanguages).includes(language)) {
      return { error: msg`Linguaggio non consentito per questo task` };
    }
  }

  const submissionFiles: Record<string, string> = {};
  const sizeLimit = task.taskType === "OutputOnly" ? 75_000_000 : 100_000;

  for (const file of task.submissionFormat) {
    const content = formData.get(file);
    if (!content) return { error: msg`File mancante` };

    const size = isString(content) ? content.length : content.size;
    if (size > sizeLimit) return { error: msg`File troppo grande` };

    const buffer = isString(content)
      ? Buffer.from(content)
      : Buffer.from(await content.arrayBuffer());
    try {
      submissionFiles[file] = await saveFile(
        buffer,
        `Submission file ${file} sent by ${user.username} at ${Date.now()}.`,
      );
    } catch (err) {
      logger.error("Failed to save file", err);
      return { error: msg`Errore durante il salvataggio del file` };
    }
  }

  let submissionId: number;
  try {
    submissionId = await cmsDb.transaction(async (tx) => {
      const participationId = tx
        .select({ id: participations.id })
        .from(participations)
        .where(
          and(
            eq(participations.userId, user.cmsId),
            eq(participations.contestId, Number(process.env.CMS_CONTEST_ID)),
          ),
        );

      const [submission] = await tx
        .insert(submissions)
        .values({
          participationId: sql`${participationId}`,
          taskId: task.id,
          timestamp: sql`NOW()`,
          language,
        })
        .returning();

      await tx.insert(files).values(
        Object.entries(submissionFiles).map(([filename, digest]) => ({
          submissionId: submission.id,
          filename,
          digest,
        })),
      );

      return submission.id;
    });
  } catch (err) {
    logger.error("Failed to insert submission", err);
    return { error: msg`Errore durante l'invio della sottoposizione` };
  }

  try {
    await sendSubmission(submissionId);
  } catch (err) {
    logger.error("Failed to notify EvaluationService", err);
  }

  return { submissionId };
}

async function checkPastSubmissions(taskName: string, userId: number) {
  const [res] = await cmsDb
    .select({
      count: count(),
    })
    .from(submissions)
    .innerJoin(tasks, eq(tasks.id, submissions.taskId))
    .innerJoin(participations, eq(participations.id, submissions.participationId))
    .where(
      and(
        eq(tasks.name, taskName),
        eq(participations.userId, userId),
        gt(submissions.timestamp, sql`NOW() - INTERVAL '1 minute'`),
      ),
    );
  return res.count >= 4;
}
