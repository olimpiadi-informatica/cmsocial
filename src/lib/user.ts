import { headers } from "next/headers";
import { cache } from "react";

import { auth } from "./auth";
import type { Statements } from "./auth/permissions";
import { RegistrationStep, type User } from "./auth/types";

export const getSessionUser = cache(
  async (allowUnfinishedRegistration?: boolean): Promise<User | undefined> => {
    const session = await auth.api
      .getSession({
        headers: await headers(),
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
    headers: await headers(),
    body: {
      userId: user.id,
      permission: { [resource]: [action] },
    },
  });
  return result.success;
});

export const getUserProviders = cache(async function hasPasswordAccount() {
  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });
  return accounts.map(
    (account) => account.provider as "credential" | "github" | "google" | "olimanager",
  );
});
