import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { Trans } from "@lingui/react/macro";
import { GraduationCap, LinkIcon, LockKeyhole, Trash2, UserIcon } from "lucide-react";

import { Link } from "~/components/link";
import { loadLocale } from "~/lib/locale";
import { getSessionUser, getUserProviders } from "~/lib/user";

import { ProfilePicture } from "./picture";

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
    redirect(`/login?redirect=${encodeURIComponent("/settings/profile")}`);
  }

  const hasPasswordAccount = (await getUserProviders()).includes("credential");

  return (
    <div className="flex gap-4 grow max-md:flex-col">
      <div className="flex flex-col bg-base-300 rounded-lg p-6 pt-4 md:w-72 max-md:items-center">
        <ProfilePicture user={user} />
        <div className="font-bold text-wrap">{user.name}</div>
        <div className="text-sm text-base-content/80 truncate">{user.email}</div>
        <hr className="border-base-content/40 my-4 w-full" />
        <div className="flex flex-col gap-4">
          <Link href="/settings/profile" className="flex gap-2 items-center">
            <UserIcon size={16} />
            <Trans>Modifica profilo</Trans>
          </Link>
          {hasPasswordAccount && (
            <Link href="/settings/password" className="flex gap-2 items-center">
              <LockKeyhole size={16} />
              <Trans>Modifica password</Trans>
            </Link>
          )}
          <Link href="/settings/school" className="flex gap-2 items-center">
            <GraduationCap size={16} />
            <Trans>Modifica scuola</Trans>
          </Link>
          <Link href="/settings/social" className="flex gap-2 items-center">
            <LinkIcon size={16} />
            <Trans>Account collegati</Trans>
          </Link>
          <Link href="/settings/delete" className="flex gap-2 items-center">
            <Trash2 size={16} />
            <Trans>Cancella account</Trans>
          </Link>
        </div>
      </div>
      <div className="grow p-4">{children}</div>
    </div>
  );
}
