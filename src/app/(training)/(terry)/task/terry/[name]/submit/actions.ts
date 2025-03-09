"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  type Submission,
  abandonInput,
  generateInput,
  submit,
  uploadOutput,
  uploadSource,
} from "@olinfo/terry-api";

import { getSessionUser } from "~/lib/user";

export async function requestInput(taskName: string): Promise<string | undefined> {
  const user = getSessionUser();
  if (!user) return;

  try {
    await generateInput(user.username, taskName);
  } catch (err) {
    return (err as Error).message;
  }
  revalidatePath("/(training)/(terry)/task/terry/[name]", "layout");
}

export async function changeInput(inputId: string): Promise<string | undefined> {
  const user = getSessionUser();
  if (!user) return;

  try {
    await abandonInput(user.username, inputId);
  } catch (err) {
    return (err as Error).message;
  }
  revalidatePath("/(training)/(terry)/task/terry/[name]", "layout");
}

export async function uploadAndSubmit(
  taskName: string,
  inputId: string,
  files: FormData,
): Promise<string | undefined> {
  let submission: Submission;
  try {
    const [source, output] = await Promise.all([
      uploadSource(inputId, files.get("source") as File),
      uploadOutput(inputId, files.get("output") as File),
    ]);

    for (const alert of source.validation.alerts) {
      if (alert.severity === "warning") {
        return alert.message;
      }
    }

    submission = await submit(inputId, source.id, output.id);
  } catch (err) {
    return (err as Error).message;
  }
  redirect(`/task/terry/${taskName}/submissions/${submission.id}`);
}
