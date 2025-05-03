"use client";

import { useParams, useSelectedLayoutSegment } from "next/navigation";
import type { ReactNode } from "react";

import { Trans } from "@lingui/react/macro";
import { Tabs } from "@olinfo/react-components";
import clsx from "clsx";

import { Link } from "~/components/link";

export function UserEditTabs() {
  return (
    <Tabs>
      <Tab page="password">
        <Trans>Password</Trans>
      </Tab>
      <Tab page="email">
        <Trans>Email</Trans>
      </Tab>
      <Tab page="avatar">
        <Trans>Foto</Trans>
      </Tab>
      <Tab page="school">
        <Trans>Scuola</Trans>
      </Tab>
      <Tab page="delete">
        <Trans>Eliminazione</Trans>
      </Tab>
    </Tabs>
  );
}

type TabProps = {
  page: string;
  children: ReactNode;
};

function Tab({ page, children }: TabProps) {
  const selectedPage = useSelectedLayoutSegment();
  const { username } = useParams();

  return (
    <Link
      role="tab"
      className={clsx("tab", selectedPage === page && "tab-active")}
      href={`/user/${username}/edit/${page}`}
      prefetch>
      {children}
    </Link>
  );
}
