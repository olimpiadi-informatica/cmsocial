"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";

import { auth } from "~/lib/auth";
import { getAuthError } from "~/lib/auth/errors";

export async function deleteUser(): Promise<MessageDescriptor | undefined> {
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
