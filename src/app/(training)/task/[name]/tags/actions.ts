"use server";

import type { MessageDescriptor } from "@lingui/core";
import { revalidatePath } from "next/cache";

import { msg } from "@lingui/macro";
import { addTaskTag, removeTaskTag } from "~/lib/api/task-tags";
import { getSessionUser } from "~/lib/user";

export async function addTag(
  taskName: string,
  tagName: string,
): Promise<MessageDescriptor | undefined> {
  const user = getSessionUser();
  if (!user) return msg`Non sei autorizzato`;

  const err = await addTaskTag(user.id, taskName, tagName);
  if (err) return err;

  revalidatePath("/(training)/task/[name]", "layout");
}

export async function removeTag(
  taskName: string,
  tagName: string,
): Promise<MessageDescriptor | undefined> {
  const user = getSessionUser();
  if (!user) return msg`Non sei autorizzato`;

  const err = await removeTaskTag(user.id, taskName, tagName);
  if (err) return err;

  revalidatePath("/(training)/task/[name]", "layout");
}
