import { Trans } from "@lingui/react/macro";
import {
  Avatar,
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "@olinfo/react-components";
import { SettingsIcon, UserRound } from "lucide-react";

import { Link } from "~/components/link";
import type { User } from "~/lib/auth/types";
import { getSessionUser } from "~/lib/user";

import { LoginButton } from "./login-button";
import { LogoutButton } from "./logout-button";

export async function UserDropdown() {
  const user = await getSessionUser();
  return user ? <UserDropdownInner user={user} /> : <LoginButton />;
}

function UserDropdownInner({ user }: { user: User }) {
  return (
    <Dropdown className="dropdown-end">
      <DropdownButton>
        <Avatar size={32} username={user.username} url={user.image} />
        <div className="truncate uppercase max-sm:hidden md:max-lg:hidden">{user.username}</div>
      </DropdownButton>
      <DropdownMenu>
        <DropdownItem>
          <Link href={`/user/${user.username}`} className="flex justify-between gap-4">
            <Trans>Profilo</Trans> <UserRound size={20} />
          </Link>
        </DropdownItem>
        <DropdownItem>
          <Link href="/settings" className="flex justify-between gap-4">
            <Trans>Impostazioni</Trans> <SettingsIcon size={20} />
          </Link>
        </DropdownItem>
        <LogoutButton />
      </DropdownMenu>
    </Dropdown>
  );
}
