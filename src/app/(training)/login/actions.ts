"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";

import { checkUsername, getRegistrationStep, getUsernameVariants } from "~/lib/api/auth";
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
    if (usernameOrEmail?.includes("@")) {
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
      const err = checkUsername(usernameOrEmail);
      if (err) return err;

      const usernameVariants = await getUsernameVariants(usernameOrEmail);
      if (usernameVariants.length !== 1 && !usernameVariants.includes(usernameOrEmail)) {
        return msg`Username non esistente`;
      }

      const resp = await auth.api.signInUsername({
        headers: await headers(),
        body: {
          username: usernameVariants[0],
          password,
          rememberMe: true,
        },
      });
      if (!resp) return msg`Errore sconosciuto`;
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

export async function loginSocial(provider: string, redirectUrl: string) {
  let url: string | undefined;
  try {
    const resp = await auth.api.signInSocial({
      headers: await headers(),
      body: {
        provider,
        callbackURL: redirectUrl,
        newUserCallbackURL: "/signup",
      },
    });
    url = resp.url;
  } catch (err) {
    return getAuthError(err);
  }

  if (!url) return msg`Errore durante il login`;
  redirect(url);
}

export async function loginOAuth(providerId: string, redirectUrl: string) {
  let url: string | undefined;
  try {
    const resp = await auth.api.signInWithOAuth2({
      headers: await headers(),
      body: {
        providerId,
        callbackURL: redirectUrl,
        newUserCallbackURL: "/signup",
      },
    });
    url = resp.url;
  } catch (err) {
    return getAuthError(err);
  }

  if (!url) return msg`Errore durante il login`;
  redirect(url);
}
