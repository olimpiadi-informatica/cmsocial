import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { Trans } from "@lingui/macro";
import { getMe } from "@olinfo/training-api";

import { H1 } from "~/components/header";
import { loadLocale } from "~/lib/locale";

import { UserEditTabs } from "./tabs";

export const metadata: Metadata = {
  title: "Training - Modifica profilo",
};

type Props = {
  params: { username: string };
  children: ReactNode;
};

export default async function Layout({ params: { username }, children }: Props) {
  await loadLocale();
  const me = await getMe();

  if (!me) {
    redirect(`/login?redirect=${encodeURIComponent(`/user/${username}/edit`)}`);
  }
  if (me.username !== username) {
    redirect(`/user/${me.username}/edit`);
  }

  return (
    <div className="flex flex-col gap-4">
      <H1>
        <Trans>Modifica profilo</Trans>
      </H1>
      <UserEditTabs />
      {children}
    </div>
  );
}
