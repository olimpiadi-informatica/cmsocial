"use client";

import { useRouter } from "next/navigation";

import { Trans } from "@lingui/react/macro";
import { LogOut } from "lucide-react";

import { logout } from "./actions";
import { DropdownAction } from "./dropdown-action";

export function LogoutButton() {
  const router = useRouter();

  const onLogout = async () => {
    const err = await logout();
    if (err) return err;
    router.refresh();
  };

  return (
    <DropdownAction action={onLogout} className="flex justify-between gap-4">
      <Trans>Esci</Trans> <LogOut size={20} />
    </DropdownAction>
  );
}
