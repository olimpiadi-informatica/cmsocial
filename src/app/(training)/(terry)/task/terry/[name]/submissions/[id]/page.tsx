import { notFound } from "next/navigation";
import { Fragment, type ReactNode } from "react";

import { Trans } from "@lingui/macro";
import { DateTime } from "@olinfo/react-components";
import { type Submission, getSubmission, getUser } from "@olinfo/terry-api";
import { getMe } from "@olinfo/training-api";
import clsx from "clsx";
import { Check, FileInput, FileOutput, X } from "lucide-react";

import { H2, H3 } from "~/components/header";
import { OutcomeScore } from "~/components/outcome";
import { SourceCode } from "~/components/source-code";
import { fileLanguageName } from "~/lib/language";
import { loadLocale } from "~/lib/locale";

type Props = {
  params: { name: string; id: string };
};

export default async function Page({ params: { name: taskName, id } }: Props) {
  const i18n = await loadLocale();

  const trainingUser = await getMe();
  if (!trainingUser) return null;

  const user = await getUser(trainingUser.username);
  const task = user.contest.tasks.find((t) => t.name === taskName);
  if (!task) notFound();

  const submission = await getSubmission(id);
  const alerts = [...submission.feedback.alerts, ...submission.output.validation.alerts];

  return (
    <div>
      <H2>
        <Trans>Sottoposizione</Trans> {submission.input.attempt}-{submission.id.split("-")[0]}
      </H2>
      <H3 className="mb-2 mt-6">
        <Trans>Dettagli</Trans>
      </H3>
      <ul className="w-full rounded-box bg-base-200 p-2 *:p-2">
        <li>
          <span className="font-bold">
            <Trans>Esito:</Trans>
          </span>{" "}
          <OutcomeScore score={submission.score} maxScore={task.max_score} />
        </li>
        <li>
          <span className="font-bold">
            <Trans>Linguaggio:</Trans>
          </span>{" "}
          {fileLanguageName(submission.source.path)}
        </li>
        <li>
          <span className="font-bold">
            <Trans>Data e ora:</Trans>
          </span>{" "}
          <DateTime date={submission.date} locale={i18n.locale} />
        </li>
        {alerts.length > 0 && (
          <li>
            <div className="mb-1 font-bold">Note:</div>
            <div className="rounded-xl border border-base-content/10 bg-base-100 p-2 whitespace-pre-line text-xs">
              {alerts.map((alert, i) => (
                <div key={i}>
                  {alert.severity === "success" && (
                    <span className="text-info">
                      <Trans>Nota:</Trans>{" "}
                    </span>
                  )}
                  {alert.severity === "warning" && (
                    <span className="text-warning">
                      <Trans>Attenzione:</Trans>{" "}
                    </span>
                  )}
                  {alert.severity === "danger" && (
                    <span className="text-warning">
                      <Trans>Errore:</Trans>{" "}
                    </span>
                  )}
                  {alert.message}
                </div>
              ))}
            </div>
          </li>
        )}
      </ul>
      <H3 className="mb-2 mt-6">
        <Trans>Testcases</Trans>
      </H3>
      <div className="w-full overflow-x-auto max-md:w-screen max-md:-translate-x-4 max-md:px-4">
        <TestcaseTable submission={submission} />
      </div>
      <H3 className="mb-2 mt-6">
        <Trans>Codice sorgente</Trans>
      </H3>
      <SourceCode url={`${process.env.NEXT_PUBLIC_TERRY_URL}/files/${submission.source.path}`} />
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <a href={`/api-terry/files/${submission.input.path}`} className="btn btn-primary" download>
          <FileInput size={22} /> <Trans>Scarica input</Trans>
        </a>
        <a href={`/api-terry/files/${submission.output.path}`} className="btn btn-primary" download>
          <FileOutput size={22} /> <Trans>Scarica output</Trans>
        </a>
      </div>
    </div>
  );
}

function TestcaseTable({ submission }: { submission: Submission }) {
  return (
    <div className="grid min-w-fit grid-cols-[auto_auto_1fr] text-nowrap rounded-box bg-base-200 px-4 py-2 text-sm *:px-2 *:py-1">
      <Header>
        <Trans>Testcase</Trans>
      </Header>
      <Header>
        <Trans>Risultato</Trans>
      </Header>
      <Header className="text-center">
        <Trans>Dettagli</Trans>
      </Header>
      {submission.feedback.cases.map((tc, idx) => {
        const output = submission.output.validation.cases[idx];
        return (
          <Fragment key={idx}>
            <div className="font-mono">Case #{idx + 1}</div>
            {tc.correct ? (
              <div className="text-success">
                <Check className="inline" /> <Trans>Corretto</Trans>
              </div>
            ) : output.status === "missing" ? (
              <div className="text-error">
                <X className="inline" /> <Trans>Non inviato</Trans>
              </div>
            ) : (
              <div className="text-error">
                <X className="inline" /> <Trans>Errato</Trans>
              </div>
            )}
            <div className="min-w-40 text-wrap">{tc.message ?? output.message}</div>
          </Fragment>
        );
      })}
    </div>
  );
}

function Header({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx("!py-2 text-sm font-bold opacity-60", className)}>{children}</div>;
}
