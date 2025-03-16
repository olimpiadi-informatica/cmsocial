"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Trans } from "@lingui/react/macro";
import { Menu } from "@olinfo/react-components";

import { DateTime } from "~/components/date";
import { H2 } from "~/components/header";
import { Outcome } from "~/components/outcome";
import type { Submission } from "~/lib/api/submissions";

type Props = {
  taskName: string;
  submissions: Submission[];
};

export function PageClient({ taskName, submissions }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (submissions.some(isEvaluating)) {
      const id = setInterval(() => router.refresh(), 1000);
      return () => clearInterval(id);
    }
  }, [submissions, router]);

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
                <div>{sub.language}</div>
                <div>
                  <DateTime date={sub.timestamp} />
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

function isEvaluating(submission: Submission) {
  if (submission.compilationOutcome === null) return true;
  if (submission.compilationOutcome === "fail") return false;
  return submission.score === null;
}
