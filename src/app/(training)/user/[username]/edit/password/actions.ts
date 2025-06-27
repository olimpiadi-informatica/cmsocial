"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";

import { auth } from "~/lib/auth";
import { getAuthError } from "~/lib/auth/errors";

export async function changePassword(
  username: string,
  currentPassword: string,
  newPassword: string,
): Promise<MessageDescriptor | undefined> {
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
  redirect(`/user/${username}?notify=${encodeURIComponent(messageId)}`);
}
