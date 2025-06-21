"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { logger } from "better-auth";

import { auth } from "~/lib/auth";
import { getAuthError } from "~/lib/auth/errors";
import { getSessionUser, verifyPassword } from "~/lib/user";

export async function deleteAccount(
  password: string,
  token: string | null,
): Promise<MessageDescriptor | undefined> {
  if (!token) return msg`Token non valido`;

  const user = await getSessionUser();
  if (!user) return msg`Utente non trovato`;

  const err = await verifyPassword(password);
  if (err) return err;

  logger.warn(`Deleting user ${user.username}`);

  try {
    await auth.api.deleteUserCallback({
      headers: await headers(),
      query: { token },
    });
  } catch (err) {
    return getAuthError(err);
  }

  const messageId = msg`Account eliminato con successo!`.id;
  redirect(`/?notify=${encodeURIComponent(messageId)}`);
}
