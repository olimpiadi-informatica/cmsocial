"use client";

import Link from "next/link";
import { useParams, useSelectedLayoutSegment } from "next/navigation";
import type { ReactNode } from "react";

import { Trans } from "@lingui/macro";
import { Tabs } from "@olinfo/react-components";
import clsx from "clsx";

export function TaskTabs() {
  return (
    <Tabs>
      <Tab page="">
        <Trans>Testo</Trans>
      </Tab>
      <Tab page="submit">
        <Trans>Invia</Trans>
      </Tab>
      <Tab page="submissions">
        <Trans>Sottoposizioni</Trans>
      </Tab>
      <Tab page="help">
        <Trans>Aiuto</Trans>
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
  const { name: taskName } = useParams();

  return (
    <Link
      role="tab"
      className={clsx("tab", selectedPage === page && "tab-active")}
      href={`/task/terry/${taskName}/${page}`}
      prefetch>
      {children}
    </Link>
  );
}
