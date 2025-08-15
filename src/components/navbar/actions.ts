"use server";

import { headers } from "next/headers";

import type { MessageDescriptor } from "@lingui/core";

import { auth } from "~/lib/auth";
import { getAuthError } from "~/lib/auth/errors";
import { getSessionUser } from "~/lib/user";

export async function logout(): Promise<MessageDescriptor | undefined> {
  const user = await getSessionUser();

  try {
    if (user?.impersonatedBy) {
      await auth.api.stopImpersonating({ headers: await headers() });
    } else {
      await auth.api.signOut({ headers: await headers() });
    }
  } catch (err) {
    return getAuthError(err);
  }
}
