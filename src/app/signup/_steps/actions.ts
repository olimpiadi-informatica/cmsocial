"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { logger } from "better-auth";

import { createParticipation, createUser, updateRole } from "~/lib/api/auth";
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
        name: email.split("@")[0],
      },
    });
  } catch (err) {
    return getAuthError(err);
  }

  logger.info(`User ${email} created`);
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
  if (!user) return msg`Utente non trovato`;
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

const NAME_REGEX = /^[\p{L}\s'-]{3,32}$/u;

export async function step3(username: string, firstName: string, lastName: string) {
  const user = await getSessionUser(true);
  if (!user) return msg`Utente non trovato`;
  if (!user.emailVerified || user.registrationStep !== RegistrationStep.Profile) {
    revalidatePath("/", "layout");
    return;
  }

  if (!username) return msg`Username non valido`;
  if (!NAME_REGEX.test(firstName)) return msg`Nome non valido`;
  if (!NAME_REGEX.test(lastName)) return msg`Cognome non valido`;

  try {
    await auth.api.updateUser({
      headers: await headers(),
      body: {
        name: `${firstName} ${lastName}`,
        username,
      },
    });

    const cmsId = await createUser(username, firstName, lastName);
    await createParticipation(cmsId);

    await auth.api.updateUser({
      headers: await headers(),
      body: {
        cmsId,
        registrationStep: RegistrationStep.School,
      },
    });

    await updateRole(user.id, "newbie");
  } catch (err) {
    return getAuthError(err);
  }

  revalidatePath("/", "layout");
}

export async function step4(institute: string | undefined) {
  const user = await getSessionUser(true);
  if (!user) return msg`Utente non trovato`;
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

  logger.info(`User ${user} has completed the registration process.`);
}
