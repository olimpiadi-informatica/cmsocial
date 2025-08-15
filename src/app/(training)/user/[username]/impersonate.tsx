"use client";

import { useRouter } from "next/navigation";

import { Trans, useLingui } from "@lingui/react/macro";
import { Button } from "@olinfo/react-components";
import { UserStar } from "lucide-react";

import type { User } from "~/lib/api/user";

import { impersonate } from "./actions";

export function ImpersonateButton({ user }: { user: User }) {
  const { t } = useLingui();
  const router = useRouter();

  const onImpersonate = async () => {
    const err = await impersonate(user.id);
    if (err) throw new Error(t(err));
    router.refresh();
    await new Promise(() => {});
  };

  return (
    <Button className="btn-error" onClick={onImpersonate} icon={UserStar}>
      <Trans>Impersonifica</Trans>
    </Button>
  );
}
