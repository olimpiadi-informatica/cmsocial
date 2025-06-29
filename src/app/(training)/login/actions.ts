"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { MessageDescriptor } from "@lingui/core";

import { getRegistrationStep } from "~/lib/api/auth";
import { auth } from "~/lib/auth";
import { getAuthError } from "~/lib/auth/errors";
import { RegistrationStep } from "~/lib/auth/types";

export async function loginPassword(
  usernameOrEmail: string,
  password: string,
  redirectUrl: string,
): Promise<MessageDescriptor | undefined> {
  let userId: string;

  try {
    if (usernameOrEmail.includes("@")) {
      const resp = await auth.api.signInEmail({
        headers: await headers(),
        body: {
          email: usernameOrEmail,
          password,
          rememberMe: true,
        },
      });
      userId = resp.user.id;
    } else {
      const resp = await auth.api.signInUsername({
        headers: await headers(),
        body: {
          username: usernameOrEmail,
          password,
          rememberMe: true,
        },
      });
      userId = resp.user.id;
    }
  } catch (err) {
    return getAuthError(err);
  }

  revalidatePath("/", "layout");

  const registrationStep = await getRegistrationStep(userId);
  if (registrationStep !== RegistrationStep.Completed) {
    redirect("/signup");
  }
  redirect(redirectUrl);
}
