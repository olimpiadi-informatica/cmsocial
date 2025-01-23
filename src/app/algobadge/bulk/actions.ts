"use server";

import { getAlgobadgeScores as getAlgobadgeScoresAPI } from "~/lib/api/algobadge";

export async function getAlgobadgeScores(username: string) {
  return await getAlgobadgeScoresAPI(username);
}
