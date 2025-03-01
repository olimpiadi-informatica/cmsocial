"use client";

import Link from "next/link";
import { useSearchParams, useSelectedLayoutSegment } from "next/navigation";
import type { ReactNode } from "react";

import { Trans } from "@lingui/macro";
import { Tabs } from "@olinfo/react-components";
import clsx from "clsx";

export function LoginTabs() {
  return (
    <Tabs>
      <Tab page="login">
        <Trans>Accedi</Trans>
      </Tab>
      <Tab page="signup">
        <Trans>Registrati</Trans>
      </Tab>
    </Tabs>
  );
}

type TabProps = {
  page: string;
  children: ReactNode;
};

function Tab({ page, children }: TabProps) {
  const selectedPage = useSelectedLayoutSegment() ?? "";
  const params = useSearchParams();

  return (
    <Link
      role="tab"
      className={clsx("tab", selectedPage === page && "tab-active")}
      href={`/${page}?${params}`}
      prefetch>
      {children}
    </Link>
  );
}
