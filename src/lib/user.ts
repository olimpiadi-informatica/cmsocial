import { headers } from "next/headers";
import { cache } from "react";

import { msg } from "@lingui/core/macro";

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

    const user = session?.user as User | undefined;

    if (
      !allowUnfinishedRegistration &&
      user &&
      user.registrationStep !== RegistrationStep.Completed
    ) {
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

export async function verifyPassword(password: string) {
  const user = await getSessionUser();
  if (!user) return msg`Utente non trovato`;

  const ctx = await auth.$context;

  const accounts = await ctx.internalAdapter.findAccounts(user.id);
  const account = accounts.find(
    (account) => account.providerId === "credential" && account.password,
  );
  if (!account || !account.password) {
    return msg`Utente non trovato`;
  }

  const verify = await ctx.password.verify({
    hash: account.password,
    password,
  });
  if (!verify) return msg`Password non valida`;
}
