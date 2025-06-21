"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { logger } from "better-auth";

import { auth } from "~/lib/auth";
import { getAuthError } from "~/lib/auth/errors";

export async function resetPassword(
  email: string | null,
  newPassword: string,
  token: string | null,
): Promise<MessageDescriptor | undefined> {
  if (!email) return msg`Email non valida`;
  if (!token) return msg`Token non valido`;

  logger.info(`Resetting user password ${email}`);

  try {
    await auth.api.resetPassword({
      headers: await headers(),
      body: {
        newPassword,
        token,
      },
    });
    await auth.api.signInEmail({
      headers: await headers(),
      body: {
        email,
        password: newPassword,
      },
    });
  } catch (err) {
    return getAuthError(err);
  }

  const messageId = msg`Password modificata con successo!`.id;
  redirect(`/?notify=${encodeURIComponent(messageId)}`);
}
