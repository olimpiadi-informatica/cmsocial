"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";

import { deleteUser } from "~/lib/api/registration";
import { auth } from "~/lib/auth";
import { getAuthError } from "~/lib/auth/errors";

export async function signup(
  email: string,
  username: string,
  password: string,
  firstName: string,
  lastName: string,
  institute: string | undefined,
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
        username,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        institute,
      },
    });
  } catch (err) {
    await deleteUser(email);
    return getAuthError(err);
  }

  revalidatePath("/", "layout");
  const messageId = msg`Controlla la tua casella di posta per confermare l'account.`.id;
  redirect(`/?notify=${encodeURIComponent(messageId)}`);
}
