"use server";

import { addTag as addTagAPI, removeTag as removeTagAPI } from "@olinfo/training-api";
import { revalidatePath } from "next/cache";

export async function addTag(taskName: string, tagName: string): Promise<string | undefined> {
  try {
    await addTagAPI(taskName, tagName);
  } catch (err) {
    return (err as Error).message;
  }
  revalidatePath("/(training)/task/[name]", "layout");
}

export async function removeTag(taskName: string, tagName: string): Promise<string | undefined> {
  try {
    await removeTagAPI(taskName, tagName);
  } catch (err) {
    return (err as Error).message;
  }
  revalidatePath("/(training)/task/[name]", "layout");
}
