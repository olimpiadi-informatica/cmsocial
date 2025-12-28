"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";

import { deleteTerryUser, deleteUser } from "~/lib/api/auth";
import { auth } from "~/lib/auth";
import { getAuthError } from "~/lib/auth/errors";
import { deleteForumUser } from "~/lib/forum/admin";
import { logger } from "~/lib/logger";
import { getSessionUser } from "~/lib/user";

export async function deleteAccount(token: string | null): Promise<MessageDescriptor | undefined> {
  if (!token) return msg`Token non valido`;

  const user = await getSessionUser();
  if (!user) return msg`Utente non autenticato`;

  logger.warn("Deleting user", { user });

  try {
    await auth.api.deleteUserCallback({
      headers: await headers(),
      query: { token },
    });
  } catch (err) {
    return getAuthError(err);
  }

  try {
    await deleteUser(user.cmsId);
    await deleteTerryUser(user.username);
    await deleteForumUser(user.username);
  } catch (err) {
    logger.error("Error deleting user", err);
    return msg`Cancellazione dell'account non completata. Contatta assistenza.`;
  }

  const messageId = msg`Account eliminato con successo!`.id;
  redirect(`/?notify=${encodeURIComponent(messageId)}`);
}
