"use client";

import { usePathname } from "next/navigation";

import { Trans } from "@lingui/react/macro";
import { LogIn } from "lucide-react";

import { Link } from "~/components/link";

export function LoginButton() {
  const path = usePathname();

  return (
    <Link
      href={`/login?redirect=${encodeURIComponent(path)}`}
      className="btn btn-ghost no-animation flex-nowrap">
      <Trans>Accedi / Registrati</Trans> <LogIn />
    </Link>
  );
}
