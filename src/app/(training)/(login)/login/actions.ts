"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { MessageDescriptor } from "@lingui/core";

import { auth } from "~/lib/auth";
import { getAuthError } from "~/lib/auth/errors";

export async function login(
  usernameOrEmail: string,
  password: string,
  rememberMe: boolean,
  redirectUrl: string,
): Promise<MessageDescriptor | undefined> {
  try {
    if (usernameOrEmail.includes("@")) {
      await auth.api.signInEmail({
        headers: await headers(),
        body: {
          email: usernameOrEmail,
          password,
          rememberMe,
        },
      });
    } else {
      await auth.api.signInUsername({
        headers: await headers(),
        body: {
          username: usernameOrEmail,
          password,
          rememberMe,
        },
      });
    }
  } catch (err) {
    return getAuthError(err);
  }

  revalidatePath("/", "layout");
  redirect(redirectUrl);
}
