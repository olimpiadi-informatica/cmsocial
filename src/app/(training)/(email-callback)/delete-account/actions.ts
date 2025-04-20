"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";

import { auth } from "~/lib/auth";
import { getAuthError } from "~/lib/auth/errors";

export async function deleteAccount(
  password: string,
  token: string | null,
): Promise<MessageDescriptor | undefined> {
  if (!token) return msg`Token non valido`;

  try {
    await auth.api.deleteUser({
      headers: await headers(),
      body: { password, token },
    });
  } catch (err) {
    return getAuthError(err);
  }

  const messageId = msg`Account eliminato con successo!`.id;
  redirect(`/?notify=${encodeURIComponent(messageId)}`);
}
