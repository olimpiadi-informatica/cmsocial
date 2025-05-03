"use server";

import { redirect } from "next/navigation";

import { submitTask } from "~/lib/api/submit";

export async function submitBatch(
  taskName: string,
  language: string,
  files: FormData,
): Promise<string | undefined> {
  let id: number;
  try {
    id = await submitTask(taskName, language, files);
  } catch (err) {
    return (err as Error).message;
  }
  redirect(`/task/${taskName}/submissions/${id}`);
}

export async function submitOutputOnly(
  taskName: string,
  files: FormData,
): Promise<string | undefined> {
  let id: number;
  try {
    id = await submitTask(taskName, undefined, files);
  } catch (err) {
    return (err as Error).message;
  }
  redirect(`/task/${taskName}/submissions/${id}`);
}
