"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { msg } from "@lingui/macro";
import { changeEmail as changeEmailAPI, login } from "@olinfo/training-api";

export async function changeEmail(
  username: string,
  password: string,
  email: string,
): Promise<string | undefined> {
  try {
    await login(username, password, false);
    await changeEmailAPI(email);
  } catch (err) {
    return (err as Error).message;
  }
  revalidatePath("/", "layout"); // The profile picture might have changed

  const messageId = msg`Email modificata con successo`.id;
  redirect(`/user/${username}?notify=${encodeURIComponent(messageId)}`);
}
