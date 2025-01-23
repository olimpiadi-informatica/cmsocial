"use server";

import { type Submission, getTaskSubmissions } from "~/lib/api/submissions";
import { getSessionUser } from "~/lib/user";

export async function getSubmissions(task: string): Promise<Submission[]> {
  const user = getSessionUser();
  if (!user) return [];
  return await getTaskSubmissions(task, user.id);
}
