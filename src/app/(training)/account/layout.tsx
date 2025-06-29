import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { Trans } from "@lingui/react/macro";
import { GraduationCap, LockKeyhole, Trash2, UserIcon } from "lucide-react";

import { Link } from "~/components/link";
import { loadLocale } from "~/lib/locale";
import { getSessionUser } from "~/lib/user";

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
    redirect(`/login?redirect=${encodeURIComponent("/account/profile")}`);
  }

  return (
    <div className="flex gap-4 grow">
      <div className="flex flex-col bg-base-300 rounded-lg p-6 pt-4 w-72">
        <ProfilePicture user={user} />
        <div className="font-bold text-wrap">{user.name}</div>
        <div className="text-sm text-base-content/80 truncate">{user.email}</div>
        <hr className="border-base-content/40 my-4" />
        <div className="flex flex-col gap-4">
          <Link href="/account/profile" className="flex gap-2 items-center">
            <UserIcon size={16} />
            <Trans>Modifica profilo</Trans>
          </Link>
          <Link href="/account/password" className="flex gap-2 items-center">
            <LockKeyhole size={16} />
            <Trans>Modifica password</Trans>
          </Link>
          <Link href="/account/school" className="flex gap-2 items-center">
            <GraduationCap size={16} />
            <Trans>Modifica scuola</Trans>
          </Link>
          <Link href="/account/delete" className="flex gap-2 items-center">
            <Trash2 size={16} />
            <Trans>Cancella account</Trans>
          </Link>
        </div>
      </div>
      <div className="grow p-4">{children}</div>
    </div>
  );
}
