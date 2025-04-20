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
  const { user } = await discourseApi("GET", `/u/by-external/${username}.json`, userSchema);
  await discourseApi("POST", `/admin/users/${user.id}/log_out.json`, successSchema);
}

export async function forumDeleteUser(username: string) {
  const { user } = await discourseApi("GET", `/u/by-external/${username}.json`, userSchema);
  await discourseApi("PUT", `/admin/users/${user.id}/anonymize.json`, successSchema);
}
