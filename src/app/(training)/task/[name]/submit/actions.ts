"use server";

import { redirect } from "next/navigation";

import {
  type Submission,
  type Task,
  submitBatch as submitBatchAPI,
  submitOutputOnly as submitOutputOnlyAPI,
} from "@olinfo/training-api";

export async function submitBatch(
  task: Task,
  language: string,
  files: FormData,
): Promise<string | undefined> {
  let submission: Submission;
  try {
    submission = await submitBatchAPI(task, language, files.get("src") as File);
  } catch (err) {
    return (err as Error).message;
  }
  redirect(`/task/${task.name}/submissions/${submission.id}`);
}

export async function submitOutputOnly(task: Task, files: FormData): Promise<string | undefined> {
  const outputs = Object.fromEntries(files.entries()) as Record<string, File>;

  let submission: Submission;
  try {
    submission = await submitOutputOnlyAPI(task, outputs);
  } catch (err) {
    return (err as Error).message;
  }
  redirect(`/task/${task.name}/submissions/${submission.id}`);
}
