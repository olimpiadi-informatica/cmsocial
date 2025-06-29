"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { logger } from "better-auth";

import {
  abandonInput,
  generateInput,
  submit,
  uploadOutput,
  uploadSource,
} from "~/lib/api/submit-terry";
import { getSessionUser, hasPermission } from "~/lib/user";

export async function requestInput(taskName: string): Promise<MessageDescriptor | undefined> {
  const user = await getSessionUser();
  if (!user) return;

  const canSubmit = await hasPermission("task", "submit");
  if (!canSubmit) return msg`Non sei autorizzato`;

  try {
    await generateInput(user.username, taskName);
  } catch (e) {
    logger.error("Error generating input:", e);
    return msg`Errore sconosciuto`;
  }
  revalidatePath("/(training)/(terry)/task/terry/[name]", "layout");
}

export async function changeInput(inputId: string): Promise<MessageDescriptor | undefined> {
  const user = await getSessionUser();
  if (!user) return;

  const canSubmit = await hasPermission("task", "submit");
  if (!canSubmit) return msg`Non sei autorizzato`;

  try {
    await abandonInput(user.username, inputId);
  } catch (e) {
    logger.error("Error abandoning input:", e);
    return msg`Errore sconosciuto`;
  }
  revalidatePath("/(training)/(terry)/task/terry/[name]", "layout");
}

export async function uploadAndSubmit(
  taskName: string,
  inputId: string,
  sourceFile: FormData,
  outputFile: FormData,
): Promise<MessageDescriptor | string | undefined> {
  const canSubmit = await hasPermission("task", "submit");
  if (!canSubmit) return msg`Non sei autorizzato`;

  let submissionId: string;
  try {
    const [source, output] = await Promise.all([
      uploadSource(inputId, sourceFile),
      uploadOutput(inputId, outputFile),
    ]);

    for (const alert of source.validation.alerts) {
      if (alert.severity === "warning") {
        return alert.message;
      }
    }

    submissionId = await submit(inputId, source.id, output.id);
  } catch (e) {
    logger.error("Error submitting:", e);
    return msg`Errore sconosciuto`;
  }
  redirect(`/task/terry/${taskName}/submissions/${submissionId}`);
}
