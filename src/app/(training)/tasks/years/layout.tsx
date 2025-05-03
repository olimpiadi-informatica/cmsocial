"use client";

import type { ReactNode } from "react";

import { Trans } from "@lingui/react/macro";
import { Tabs } from "@olinfo/react-components";
import clsx from "clsx";

import { useSelectedLayoutSegment } from "next/navigation";
import { H1 } from "~/components/header";
import { Link } from "~/components/link";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <H1 className="mb-2">
        <Trans>Problemi per anno</Trans>
      </H1>
      <div className="mb-2">
        <Tabs>
          <Tab page="oii">
            <Trans>OII</Trans>
          </Tab>
          <Tab page="ois">
            <Trans>OIS</Trans>
          </Tab>
        </Tabs>
      </div>
      {children}
    </>
  );
}

type TabProps = {
  page: string;
  children: ReactNode;
};

function Tab({ page, children }: TabProps) {
  const selectedPage = useSelectedLayoutSegment();

  return (
    <Link
      role="tab"
      className={clsx("tab", selectedPage === page && "tab-active")}
      href={`/tasks/years/${page}`}
      prefetch>
      {children}
    </Link>
  );
}
