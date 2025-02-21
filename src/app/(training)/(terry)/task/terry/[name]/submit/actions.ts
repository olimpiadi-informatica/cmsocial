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

export async function requestInput(token: string, taskName: string): Promise<string | undefined> {
  try {
    await generateInput(token, taskName);
  } catch (err) {
    return (err as Error).message;
  }
  revalidatePath("/(training)/(terry)/task/terry/[name]", "layout");
}

export async function changeInput(token: string, inputId: string): Promise<string | undefined> {
  try {
    await abandonInput(token, inputId);
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
