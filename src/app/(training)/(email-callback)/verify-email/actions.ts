"use server";

import { headers } from "next/headers";

import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { redirect } from "next/navigation";

import { auth } from "~/lib/auth";
import { getAuthError } from "~/lib/auth/errors";

export async function verifyEmail(token: string | null): Promise<MessageDescriptor | undefined> {
  if (!token) return msg`Token non valido`;

  try {
    await auth.api.verifyEmail({
      headers: await headers(),
      query: { token },
    });
  } catch (err) {
    return getAuthError(err);
  }

  const messageId = msg`Email verificata con successo!`.id;
  redirect(`/?notify=${encodeURIComponent(messageId)}`);
}
