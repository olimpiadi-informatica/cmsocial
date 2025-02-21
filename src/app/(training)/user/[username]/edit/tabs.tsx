"use client";

import Link from "next/link";
import { useParams, useSelectedLayoutSegment } from "next/navigation";

import { Trans } from "@lingui/macro";
import { Tabs } from "@olinfo/react-components";
import clsx from "clsx";
import type { ReactNode } from "react";

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
      {/*
          TODO: replace user.institute_id with user.social_user.institute_id here
                https://github.com/algorithm-ninja/cmsocial/blob/master/cmsocial/server/pws.py#L829
        */}
      {/* <Tab page="school">Scuola</Tab> */}

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
