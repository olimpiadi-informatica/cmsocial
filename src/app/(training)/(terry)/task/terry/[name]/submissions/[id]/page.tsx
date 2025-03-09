import { notFound, redirect } from "next/navigation";
import { Fragment, type ReactNode } from "react";

import { Trans } from "@lingui/macro";
import clsx from "clsx";
import { Check, FileInput, FileOutput, X } from "lucide-react";

import { DateTime } from "~/components/datetime";
import { H2, H3 } from "~/components/header";
import { OutcomeScore } from "~/components/outcome";
import { SourceCode } from "~/components/source-code";
import { type TerrySubmissionDetail, getTerrySubmission } from "~/lib/api/submission-terry";
import { Language, fileLanguage, fileLanguageName } from "~/lib/language";
import { loadLocale } from "~/lib/locale";
import { getSessionUser } from "~/lib/user";

type Props = {
  params: { name: string; id: string };
};

export default async function Page({ params: { name: taskName, id } }: Props) {
  const i18n = await loadLocale();

  const user = getSessionUser();
  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(`/task/terry/${taskName}/submissions/${id}`)}`);
  }

  const submission = await getTerrySubmission(id, user.username);
  if (!submission) notFound();

  const lang = fileLanguage(submission.source) ?? Language.Plain;

  return (
    <div>
      <H2>
        <Trans>Sottoposizione</Trans> {id.split("-")[0]}
      </H2>
      <H3 className="mb-2 mt-6">
        <Trans>Dettagli</Trans>
      </H3>
      <ul className="w-full rounded-box bg-base-200 p-2 *:p-2">
        <li>
          <span className="font-bold">
            <Trans>Esito:</Trans>
          </span>{" "}
          <OutcomeScore score={submission.score} maxScore={submission.maxScore} />
        </li>
        <li>
          <span className="font-bold">
            <Trans>Linguaggio:</Trans>
          </span>{" "}
          {fileLanguageName(submission.source)}
        </li>
        <li>
          <span className="font-bold">
            <Trans>Data e ora:</Trans>
          </span>{" "}
          <DateTime date={submission.date} locale={i18n.locale} />
        </li>
        {submission.alerts.length > 0 && (
          <li>
            <div className="mb-1 font-bold">Note:</div>
            <div className="rounded-xl border border-base-content/10 bg-base-100 p-2 whitespace-pre-line text-xs">
              {submission.alerts.map((alert, i) => (
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
      <SourceCode
        url={`${process.env.NEXT_PUBLIC_TERRY_URL}/files/${submission.source}`}
        lang={lang}
      />
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <a href={`/api-terry/files/${submission.input}`} className="btn btn-primary" download>
          <FileInput size={22} /> <Trans>Scarica input</Trans>
        </a>
        <a href={`/api-terry/files/${submission.output}`} className="btn btn-primary" download>
          <FileOutput size={22} /> <Trans>Scarica output</Trans>
        </a>
      </div>
    </div>
  );
}

function TestcaseTable({ submission }: { submission: TerrySubmissionDetail }) {
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
      {submission.cases.map((tc, idx) => (
        <Fragment key={idx}>
          <div className="font-mono">Case #{idx + 1}</div>
          {tc.correct ? (
            <div className="text-success">
              <Check className="inline" /> <Trans>Corretto</Trans>
            </div>
          ) : tc.status === "missing" ? (
            <div className="text-error">
              <X className="inline" /> <Trans>Non inviato</Trans>
            </div>
          ) : (
            <div className="text-error">
              <X className="inline" /> <Trans>Errato</Trans>
            </div>
          )}
          <div className="min-w-40 text-wrap">{tc.message}</div>
        </Fragment>
      ))}
    </div>
  );
}

function Header({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx("!py-2 text-sm font-bold opacity-60", className)}>{children}</div>;
}
