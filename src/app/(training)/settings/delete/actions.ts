"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { logger } from "better-auth";

import { auth } from "~/lib/auth";
import { getAuthError } from "~/lib/auth/errors";
import { getSessionUser } from "~/lib/user";

export async function deleteUser(): Promise<MessageDescriptor | undefined> {
  const user = await getSessionUser();
  if (!user) return msg`Utente non trovato`;

  logger.info(`Request to delete user ${user.username}`);

  try {
    await auth.api.deleteUser({ headers: await headers(), body: {} });
  } catch (err) {
    return getAuthError(err);
  }

  revalidatePath("/", "layout");
  const messageId =
    msg`Controlla la tua casella di posta per completare l'eliminazione dell'account.`.id;
  redirect(`/?notify=${encodeURIComponent(messageId)}`);
}
