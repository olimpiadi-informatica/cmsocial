import { z } from "zod";

import { discourseApi } from "~/lib/forum/common";

const userSchema = z.object({
  user: z.object({
    id: z.number(),
  }),
});

const successSchema = z.object({
  success: z.literal("OK"),
});

// TODO: create hook
export async function forumLogOut(username: string) {
  const userId = await getUserId(username);
  if (userId) {
    await discourseApi("POST", `/admin/users/${userId}/log_out.json`, successSchema);
  }
}

export async function forumDeleteUser(username: string) {
  const userId = await getUserId(username);
  if (userId) {
    await discourseApi("PUT", `/admin/users/${userId}/anonymize.json`, successSchema);
  }
}

async function getUserId(username: string): Promise<number | undefined> {
  const resp = await discourseApi("GET", `/u/by-external/${username}.json`, userSchema);
  return resp?.user?.id;
}
