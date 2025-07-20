"use client";

import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import { GravatarQuickEditorCore } from "@gravatar-com/quick-editor";
import { Trans } from "@lingui/react/macro";
import { Avatar } from "@olinfo/react-components";
import clsx from "clsx";
import {
  ArrowLeft,
  ChevronRight,
  GraduationCap,
  LinkIcon,
  LockKeyhole,
  Pencil,
  Trash2,
  UserIcon,
} from "lucide-react";

import { Link } from "~/components/link";
import type { User } from "~/lib/auth/types";

type Props = {
  user: User;
  hasPasswordAccount: boolean;
  children: ReactNode;
};

export function LayoutClient({ user, hasPasswordAccount, children }: Props) {
  const page = useSelectedLayoutSegment();

  return (
    <div className="flex grow overflow-x-hidden">
      <div className="grid md:grid-cols-[18rem_1fr] gap-x-4 grow">
        <div
          className={clsx(
            "flex flex-col bg-base-300 rounded-lg p-6 pt-4 max-md:items-center",
            page && "max-md:hidden",
          )}>
          <ProfilePicture user={user} />
          <div className="font-bold text-wrap">{user.name}</div>
          <div className="text-sm text-base-content/80 truncate">{user.email}</div>
          <hr className="border-base-content/40 my-4 w-full" />
          <div className="grid grid-cols-[auto_1fr_auto] justify-between w-full">
            <SettingsLink href="/settings/profile">
              <UserIcon size={16} />
              <Trans>Modifica profilo</Trans>
            </SettingsLink>
            {hasPasswordAccount && (
              <SettingsLink href="/settings/password">
                <LockKeyhole size={16} />
                <Trans>Modifica password</Trans>
              </SettingsLink>
            )}
            <SettingsLink href="/settings/school">
              <GraduationCap size={16} />
              <Trans>Modifica scuola</Trans>
            </SettingsLink>
            <SettingsLink href="/settings/social">
              <LinkIcon size={16} />
              <Trans>Account collegati</Trans>
            </SettingsLink>
            <SettingsLink href="/settings/delete">
              <Trash2 size={16} />
              <Trans>Cancella account</Trans>
            </SettingsLink>
          </div>
        </div>
        <div className={clsx("md:pt-4", !page && "max-md:hidden")}>
          {page && (
            <div className="w-full max-w-sm mx-auto mb-4 md:hidden">
              <Link
                href="/settings"
                className="flex gap-2 items-center text-sm text-nowrap text-base-content/80 w-min">
                <ArrowLeft size={18} />
                <Trans>Torna indietro</Trans>
              </Link>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

function SettingsLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="grid grid-cols-subgrid col-span-full items-center gap-x-2 p-2 rounded-lg hover:bg-base-content/10">
      {children}
      <ChevronRight className="md:hidden" />
    </Link>
  );
}

function ProfilePicture({ user }: { user: User }) {
  const router = useRouter();
  const [quickEditor, setQuickEditor] = useState<GravatarQuickEditorCore>();

  useEffect(() => {
    setQuickEditor(
      new GravatarQuickEditorCore({
        email: user.email,
        scope: ["avatars"],
        onProfileUpdated: () => router.refresh(),
      }),
    );
  }, [user.email, router]);

  return (
    <div className="mx-auto mb-4 relative">
      <Avatar size={128} username={user.username} url={user.image} />
      <button
        className="absolute top-2 right-2 text-white bg-black/40 rounded-full p-2 pointer"
        onClick={() => quickEditor?.open()}
        type="button">
        <Pencil size={16} />
      </button>
    </div>
  );
}
