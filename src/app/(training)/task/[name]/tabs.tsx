"use client";

import { useParams, useSelectedLayoutSegment } from "next/navigation";
import type { ReactNode } from "react";

import { Trans } from "@lingui/react/macro";
import { Tabs } from "@olinfo/react-components";
import clsx from "clsx";

import { Link } from "~/components/link";

export function TaskTabs() {
  return (
    <Tabs>
      <Tab page="">
        <Trans>Testo</Trans>
      </Tab>
      <Tab page="attachments">
        <Trans>Allegati</Trans>
      </Tab>
      <Tab page="tags">
        <Trans>Tags</Trans>
      </Tab>
      <Tab page="stats">
        <Trans>Statistiche</Trans>
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
      href={`/task/${taskName}/${page}`}
      prefetch>
      {children}
    </Link>
  );
}
