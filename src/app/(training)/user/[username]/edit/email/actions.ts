"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { logger } from "better-auth";

import { auth } from "~/lib/auth";
import { getAuthError } from "~/lib/auth/errors";
import { getSessionUser, verifyPassword } from "~/lib/user";

export async function changeEmail(
  password: string,
  email: string,
): Promise<MessageDescriptor | undefined> {
  const user = await getSessionUser();
  if (!user) return msg`Utente non trovato`;

  const err = await verifyPassword(password);
  if (err) return err;

  logger.info(`Changing email from ${user.email} to ${email}`);

  try {
    await auth.api.changeEmail({
      headers: await headers(),
      body: {
        newEmail: email,
      },
    });
  } catch (err) {
    return getAuthError(err);
  }
  revalidatePath("/", "layout"); // The profile picture might have changed

  const messageId = msg`Controlla la tua casella di posta per confermare l'email.`.id;
  redirect(`/user/${user.username}?notify=${encodeURIComponent(messageId)}`);
}
