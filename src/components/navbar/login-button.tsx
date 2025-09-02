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
      <div className="max-sm:hidden md:max-lg:hidden">
        <Trans>Accedi / Registrati</Trans>
      </div>
      <LogIn />
    </Link>
  );
}
