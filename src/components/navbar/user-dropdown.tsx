import { revalidatePath } from "next/cache";
import Link from "next/link";

import { Trans } from "@lingui/macro";
import {
  Avatar,
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "@olinfo/react-components";
import { type User, getMe, logout, userPictureUrl } from "@olinfo/training-api";
import { LogOut, UserRound } from "lucide-react";

import { DropdownAction } from "./dropdown-action";
import { LoginButton } from "./login-button";

export async function UserDropdown() {
  const user = await getMe();
  return user ? <UserDropdownInner user={user} /> : <LoginButton />;
}

function UserDropdownInner({ user }: { user: User }) {
  async function onLogout(): Promise<string | undefined> {
    "use server";

    try {
      await logout();
    } catch (err) {
      return (err as Error).message;
    }
    revalidatePath("/", "layout");
  }

  return (
    <Dropdown className="dropdown-end">
      <DropdownButton>
        <Avatar size={32} username={user.username} url={userPictureUrl(user)} />
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
