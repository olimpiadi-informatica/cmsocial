"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { msg } from "@lingui/core/macro";

import { auth } from "~/lib/auth";
import { getAuthError } from "~/lib/auth/errors";

export async function linkAccount(provider: string) {
  let url: string;
  try {
    const messageId = msg`Account collegato con successo!`.id;

    if (provider === "olimanager") {
      const resp = await auth.api.oAuth2LinkAccount({
        headers: await headers(),
        body: {
          providerId: provider,
          callbackURL: `/?notify=${encodeURIComponent(messageId)}`,
        },
      });
      url = resp.url;
    } else {
      const resp = await auth.api.linkSocialAccount({
        headers: await headers(),
        body: {
          provider,
          callbackURL: `/?notify=${encodeURIComponent(messageId)}`,
        },
      });
      url = resp.url;
    }
  } catch (err) {
    return getAuthError(err);
  }

  redirect(url);
}

export async function unlinkAccount(providerId: string) {
  try {
    await auth.api.unlinkAccount({
      headers: await headers(),
      body: { providerId },
    });
  } catch (err) {
    return getAuthError(err);
  }

  revalidatePath("/", "layout");
  const messageId = msg`Account scollegato con successo!`.id;
  redirect(`/?notify=${encodeURIComponent(messageId)}`);
}
