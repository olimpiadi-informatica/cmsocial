"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";

import { auth } from "~/lib/auth";
import { getAuthError } from "~/lib/auth/errors";
import { logger } from "~/lib/logger";

export async function recoverPassword(
  email: string,
  recaptchaResponse: string | undefined | null,
): Promise<MessageDescriptor | undefined> {
  if (!recaptchaResponse) return msg`Captcha non valido`;
  const headersWithCaptcha = new Headers(await headers());
  headersWithCaptcha.set("x-captcha-response", recaptchaResponse);

  logger.info("Request to reset password for user", { email });

  try {
    await auth.api.requestPasswordReset({
      headers: headersWithCaptcha,
      body: { email },
    });
  } catch (err) {
    return getAuthError(err);
  }

  const messageId = msg`Controlla la tua casella di posta per recuperare la password.`.id;
  redirect(`/?notify=${encodeURIComponent(messageId)}`);
}
