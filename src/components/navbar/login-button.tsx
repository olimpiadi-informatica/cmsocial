"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Trans } from "@lingui/macro";
import { LogIn } from "lucide-react";

export function LoginButton() {
  const path = usePathname();

  return (
    <Link
      href={`/login?redirect=${encodeURIComponent(path)}`}
      className="btn btn-ghost no-animation flex-nowrap">
      <Trans>Accedi</Trans> <LogIn />
    </Link>
  );
}
