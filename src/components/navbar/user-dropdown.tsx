import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import type { MessageDescriptor } from "@lingui/core";
import { Trans } from "@lingui/react/macro";
import {
  Avatar,
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "@olinfo/react-components";
import { LogOut, UserRound } from "lucide-react";

import { Link } from "~/components/link";
import { auth } from "~/lib/auth";
import { getAuthError } from "~/lib/auth/errors";
import type { User } from "~/lib/auth/types";
import { getSessionUser } from "~/lib/user";

import { DropdownAction } from "./dropdown-action";
import { LoginButton } from "./login-button";

export async function UserDropdown() {
  const user = await getSessionUser();
  return user ? <UserDropdownInner user={user} /> : <LoginButton />;
}

function UserDropdownInner({ user }: { user: User }) {
  async function onLogout(): Promise<MessageDescriptor | undefined> {
    "use server";

    try {
      await auth.api.signOut({ headers: await headers() });
    } catch (err) {
      return getAuthError(err);
    }

    revalidatePath("/", "layout");
  }

  return (
    <Dropdown className="dropdown-end">
      <DropdownButton>
        <Avatar size={32} username={user.username!} url={user.image!} />
        <div className="truncate uppercase max-sm:hidden md:max-lg:hidden">{user.username}</div>
      </DropdownButton>
      <DropdownMenu>
        <DropdownItem>
          <Link href={`/user/${user.username}`} className="flex justify-between gap-4">
            <Trans>Profilo</Trans> <UserRound size={20} />
          </Link>
        </DropdownItem>
        <DropdownAction action={onLogout} className="flex justify-between gap-4">
          <Trans>Esci</Trans> <LogOut size={20} />
        </DropdownAction>
      </DropdownMenu>
    </Dropdown>
  );
}
