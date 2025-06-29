"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";

import { auth } from "~/lib/auth";
import { getAuthError } from "~/lib/auth/errors";
import { getSessionUser } from "~/lib/user";

export async function updateSchool(
  institute: string | undefined,
): Promise<MessageDescriptor | undefined> {
  const user = await getSessionUser();
  if (!user) return msg`Utente non trovato`;

  try {
    await auth.api.updateUser({
      headers: await headers(),
      body: { institute },
    });
  } catch (err) {
    return getAuthError(err);
  }

  revalidatePath("/", "layout");

  const messageId = msg`Dati aggiornati con successo`.id;
  redirect(`/user/${user.username}?notify=${encodeURIComponent(messageId)}`);
}
