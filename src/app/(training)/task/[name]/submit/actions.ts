"use server";

import { redirect } from "next/navigation";

import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";

import { submitTask } from "~/lib/api/submit";
import { hasPermission } from "~/lib/user";

export async function submitBatch(
  taskName: string,
  language: string,
  files: FormData,
): Promise<MessageDescriptor | undefined> {
  const canSubmit = await hasPermission("task", "submit");
  if (!canSubmit) return msg`Non sei autorizzato`;

  let id: number;
  try {
    id = await submitTask(taskName, language, files);
  } catch (err) {
    switch ((err as Error).message as string) {
      case "Too frequent submissions!":
        return msg`Sottoposizioni troppo frequenti`;
      default:
        return msg`Errore sconosciuto`;
    }
  }
  redirect(`/task/${taskName}/submissions/${id}`);
}

export async function submitOutputOnly(
  taskName: string,
  files: FormData,
): Promise<MessageDescriptor | undefined> {
  const canSubmit = await hasPermission("task", "submit");
  if (!canSubmit) return msg`Non sei autorizzato`;

  let id: number;
  try {
    id = await submitTask(taskName, undefined, files);
  } catch (err) {
    switch ((err as Error).message as string) {
      case "Too frequent submissions!":
        return msg`Sottoposizioni troppo frequenti`;
      default:
        return msg`Errore sconosciuto`;
    }
  }
  redirect(`/task/${taskName}/submissions/${id}`);
}
