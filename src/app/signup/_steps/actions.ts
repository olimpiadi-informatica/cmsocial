"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { logger } from "better-auth";

import {
  checkName,
  checkUsername,
  finalizeRegistration,
  getUsernameVariants,
} from "~/lib/api/auth";
import { auth } from "~/lib/auth";
import { getAuthError } from "~/lib/auth/errors";
import { RegistrationStep } from "~/lib/auth/types";
import { getSessionUser } from "~/lib/user";

export async function step1Password(
  email: string,
  password: string,
  recaptchaResponse: string | undefined | null,
): Promise<MessageDescriptor | undefined> {
  if (!recaptchaResponse) return msg`Captcha non valido`;
  const headersWithCaptcha = new Headers(await headers());
  headersWithCaptcha.set("x-captcha-response", recaptchaResponse);

  try {
    await auth.api.signUpEmail({
      headers: headersWithCaptcha,
      body: {
        email,
        password,
        name: email?.replace(/@.*$/, ""),
      },
    });
  } catch (err) {
    return getAuthError(err);
  }

  logger.info(`User ${email} created`);
}

export async function step1Social(provider: string) {
  let url: string | undefined;
  try {
    const resp = await auth.api.signInSocial({
      headers: await headers(),
      body: {
        provider,
        callbackURL: "/",
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

export async function step1OAuth(providerId: string) {
  let url: string | undefined;
  try {
    const resp = await auth.api.signInWithOAuth2({
      headers: await headers(),
      body: {
        providerId,
        callbackURL: "/",
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

export async function step2Back() {
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch (err) {
    return getAuthError(err);
  }

  revalidatePath("/", "layout");
}

export async function step2Resend() {
  const user = await getSessionUser(true);
  if (!user) return msg`Utente non autenticato`;
  if (user.emailVerified) {
    revalidatePath("/", "layout");
    return;
  }

  try {
    await auth.api.sendVerificationEmail({
      headers: await headers(),
      body: {
        email: user.email,
      },
    });
  } catch (err) {
    return getAuthError(err);
  }

  revalidatePath("/", "layout");
}

export async function step3(username: string, firstName: string, lastName: string) {
  const user = await getSessionUser(true);
  if (!user) return msg`Utente non autenticato`;
  if (!user.emailVerified || user.registrationStep !== RegistrationStep.Profile) {
    revalidatePath("/", "layout");
    return;
  }

  const err = checkName(firstName, lastName) ?? checkUsername(username);
  if (err) return err;

  const usernameVariants = await getUsernameVariants(username);
  if (usernameVariants.length > 0) {
    return msg`Username non disponibile`;
  }

  try {
    await auth.api.updateUser({
      headers: await headers(),
      body: {
        name: `${firstName} ${lastName}`,
        username,
      },
    });

    await finalizeRegistration(user.id, username, firstName, lastName);
  } catch (err) {
    return getAuthError(err);
  }

  revalidatePath("/", "layout");
}

export async function step4(institute: string | undefined) {
  const user = await getSessionUser(true);
  if (!user) return msg`Utente non autenticato`;
  if (user.registrationStep !== RegistrationStep.School) {
    revalidatePath("/", "layout");
    return;
  }

  try {
    await auth.api.updateUser({
      headers: await headers(),
      body: {
        institute,
        registrationStep: RegistrationStep.Completed,
      },
    });
  } catch (err) {
    return getAuthError(err);
  }

  revalidatePath("/", "layout");

  logger.info(`User ${user.email} has completed the registration process.`);
}
