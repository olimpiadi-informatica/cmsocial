"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";

import { auth } from "~/lib/auth";
import { getAuthError } from "~/lib/auth/errors";
import { getSessionUser } from "~/lib/user";

export async function acceptGuidelines(): Promise<MessageDescriptor | undefined> {
  const user = await getSessionUser();
  if (!user) return msg`Utente non autenticato`;

  try {
    await auth.api.updateUser({
      headers: await headers(),
      body: { guidelinesAcceptedAt: new Date() },
    });
  } catch (err) {
    return getAuthError(err);
  }

  revalidatePath("/", "layout");
}
