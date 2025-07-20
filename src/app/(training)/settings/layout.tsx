import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { loadLocale } from "~/lib/locale";
import { getSessionUser, getUserProviders } from "~/lib/user";

import { LayoutClient } from "./layout-client";

export const metadata: Metadata = {
  title: "Training - Modifica profilo",
};

type Props = {
  children: ReactNode;
};

export default async function Layout({ children }: Props) {
  await loadLocale();
  const user = await getSessionUser();

  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent("/settings")}`);
  }

  const hasPasswordAccount = (await getUserProviders()).includes("credential");

  return (
    <LayoutClient user={user} hasPasswordAccount={hasPasswordAccount}>
      {children}
    </LayoutClient>
  );
}
