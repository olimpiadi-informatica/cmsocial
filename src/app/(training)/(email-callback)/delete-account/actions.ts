"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";

import { auth } from "~/lib/auth";
import { getAuthError } from "~/lib/auth/errors";
import { verifyPassword } from "~/lib/user";

export async function deleteAccount(
  password: string,
  token: string | null,
): Promise<MessageDescriptor | undefined> {
  if (!token) return msg`Token non valido`;

  const err = await verifyPassword(password);
  if (err) return err;

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
