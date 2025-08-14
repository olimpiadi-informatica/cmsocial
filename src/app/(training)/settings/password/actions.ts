"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";

import { auth } from "~/lib/auth";
import { getAuthError } from "~/lib/auth/errors";
import { getSessionUser } from "~/lib/user";

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<MessageDescriptor | undefined> {
  const user = await getSessionUser();
  if (!user) return msg`Utente non autenticato`;

  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        newPassword,
        currentPassword,
        revokeOtherSessions: true,
      },
    });
  } catch (err) {
    return getAuthError(err);
  }

  const messageId = msg`Password modificata con successo`.id;
  redirect(`/user/${user.username}?notify=${encodeURIComponent(messageId)}`);
}
