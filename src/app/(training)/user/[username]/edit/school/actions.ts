"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";

import { updateUserSchool } from "~/lib/api/user";
import { getSessionUser } from "~/lib/user";

export async function changeSchool(
  username: string,
  institute: string,
): Promise<MessageDescriptor | undefined> {
  const user = await getSessionUser();
  if (!user) {
    return msg`Utente non trovato`;
  }

  await updateUserSchool(user.cmsId, institute);
  revalidatePath(`/user/${username}`);

  const messageId = msg`Scuola cambiata con successo`.id;
  redirect(`/user/${username}?notify=${encodeURIComponent(messageId)}`);
}
