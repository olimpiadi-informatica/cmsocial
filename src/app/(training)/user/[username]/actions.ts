"use server";

import { headers } from "next/headers";

import { auth } from "~/lib/auth";
import { getAuthError } from "~/lib/auth/errors";

export async function impersonate(userId: string) {
  "use server";

  try {
    await auth.api.impersonateUser({
      headers: await headers(),
      body: { userId },
    });
  } catch (err) {
    return getAuthError(err);
  }
}
