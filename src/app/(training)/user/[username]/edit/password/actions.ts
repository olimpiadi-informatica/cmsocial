"use server";

import { redirect } from "next/navigation";

import { msg } from "@lingui/macro";
import { changePassword as changePasswordAPI } from "@olinfo/training-api";

export async function changePassword(
  username: string,
  oldPassword: string,
  newPassword: string,
): Promise<string | undefined> {
  try {
    await changePasswordAPI(oldPassword, newPassword);
  } catch (err) {
    return (err as Error).message;
  }

  const messageId = msg`Password modificata con successo`.id;
  redirect(`/user/${username}?notify=${encodeURIComponent(messageId)}`);
}
