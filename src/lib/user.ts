import { cookies, headers } from "next/headers";
import { cache } from "react";

import { auth } from "./auth";
import type { Statements } from "./auth/permissions";
import { RegistrationStep, type User } from "./auth/types";

export async function getAuthHeaders(headerList?: Headers): Promise<Headers> {
  const reqHeaders = new Headers(headerList ?? (await headers()));
  const cookieJar = await cookies();
  const cookieString = cookieJar.toString();
  if (cookieString) {
    reqHeaders.set("cookie", cookieString);
  }
  return reqHeaders;
}

export const getSessionUser = cache(
  async (
    allowUnfinishedRegistration?: boolean,
    headerList?: Headers,
  ): Promise<User | undefined> => {
    const session = await auth.api
      .getSession({
        headers: await getAuthHeaders(headerList),
      })
      .catch(() => null);
    if (!session) return;

    const user = {
      ...session.user,
      impersonatedBy: session.session.impersonatedBy,
    } as unknown as User;

    if (!allowUnfinishedRegistration && user.registrationStep !== RegistrationStep.Completed) {
      return;
    }

    return user;
  },
);

export const hasPermission = cache(async function hasPermission<Resource extends keyof Statements>(
  resource: Resource,
  action: Statements[Resource][number],
): Promise<boolean> {
  const user = await getSessionUser();
  if (!user) return false;

  const result = await auth.api.userHasPermission({
    headers: await getAuthHeaders(),
    body: {
      userId: user.id,
      permissions: { [resource]: [action] },
    },
  });
  return result.success;
});

export const getUserProviders = cache(async function hasPasswordAccount() {
  const accounts = await auth.api.listUserAccounts({
    headers: await getAuthHeaders(),
  });
  return accounts.map(
    (account) => account.providerId as "credential" | "github" | "google" | "olimanager",
  );
});
