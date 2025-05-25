"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  abandonInput,
  generateInput,
  submit,
  uploadOutput,
  uploadSource,
} from "~/lib/api/submit-terry";
import { getSessionUser } from "~/lib/user";

export async function requestInput(taskName: string): Promise<string | undefined> {
  const user = await getSessionUser();
  if (!user) return;

  try {
    await generateInput(user.username, taskName);
  } catch (err) {
    return (err as Error).message;
  }
  revalidatePath("/(training)/(terry)/task/terry/[name]", "layout");
}

export async function changeInput(inputId: string): Promise<string | undefined> {
  const user = await getSessionUser();
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
  sourceFile: FormData,
  outputFile: FormData,
): Promise<string | undefined> {
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
  } catch (err) {
    return (err as Error).message;
  }
  redirect(`/task/terry/${taskName}/submissions/${submissionId}`);
}
