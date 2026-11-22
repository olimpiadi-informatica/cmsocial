"use client";

import { useSelectedLayoutSegment } from "next/navigation";

import { Trans } from "@lingui/react/macro";
import { Tabs } from "@olinfo/react-components";
import clsx from "clsx";

import { Link } from "~/components/link";

export function RankingTabs() {
  const isFastest = useSelectedLayoutSegment() === "fastest";

  return (
    <Tabs>
      <Link role="tab" className={clsx("tab", !isFastest && "tab-active")} href="/ranking/1">
        <Trans>Punteggio</Trans>
      </Link>
      <Link role="tab" className={clsx("tab", isFastest && "tab-active")} href="/ranking/fastest">
        <Trans>Soluzioni più veloci</Trans>
      </Link>
    </Tabs>
  );
}
