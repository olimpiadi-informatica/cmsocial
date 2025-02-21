"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

import { Trans } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { DateTime, Menu } from "@olinfo/react-components";
import { type Submission, getTaskSubmissions, isEvaluating } from "@olinfo/training-api";
import useSWR from "swr";

import { H2 } from "~/components/header";
import { Outcome } from "~/components/outcome";
import { fileLanguageName } from "~/lib/language";

type Props = {
  taskName: string;
  submissions: Submission[];
};

export function PageClient({ taskName, submissions: fallbackSubmissions }: Props) {
  const { i18n } = useLingui();

  const [refreshInterval, setRefreshInterval] = useState<number>();

  const { data: submissions } = useSWR(
    ["api/submissions", taskName],
    ([, ...params]) => getTaskSubmissions(...params),
    { fallbackData: fallbackSubmissions, refreshInterval },
  );
  if (!submissions) notFound();

  useEffect(() => {
    if (submissions.some(isEvaluating)) {
      setRefreshInterval(1000);
    } else {
      setRefreshInterval(undefined);
    }
  }, [submissions]);

  return (
    <div>
      <H2 className="mb-2">
        <Trans>Sottoposizioni</Trans>
      </H2>
      <div className="w-full overflow-x-auto max-md:w-screen max-md:-translate-x-4 max-md:px-4">
        <Menu className="grid min-w-fit grid-cols-[auto_auto_1fr_auto]">
          <h3 className="menu-title col-span-4 grid grid-cols-subgrid gap-2">
            <div>
              <Trans>ID</Trans>
            </div>
            <div>
              <Trans>Linguaggio</Trans>
            </div>
            <div>
              <Trans>Data e ora</Trans>
            </div>
            <div className="text-end">
              <Trans>Esito</Trans>
            </div>
          </h3>
          {submissions.map((sub) => (
            <li key={sub.id} className="col-span-4 grid grid-cols-subgrid">
              <Link
                href={`/task/${taskName}/submissions/${sub.id}`}
                className="col-span-4 grid grid-cols-subgrid text-nowrap">
                <div className="w-20 font-mono">{sub.id}</div>
                <div>{fileLanguageName(sub.files[0].name)}</div>
                <div>
                  <DateTime date={sub.timestamp} locale={i18n.locale} />
                </div>
                <div className="min-w-40 text-end">
                  <Outcome submission={sub} />
                </div>
              </Link>
            </li>
          ))}
          {submissions.length === 0 && (
            <li className="col-span-full p-2 text-center">
              <Trans>Nessuna sottoposizione inviata</Trans>
            </li>
          )}
        </Menu>
      </div>
    </div>
  );
}
