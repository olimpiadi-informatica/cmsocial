"use client";

import { useRouter } from "next/navigation";
import { Fragment, type ReactNode, useEffect } from "react";

import { Trans, useLingui } from "@lingui/react/macro";
import clsx from "clsx";
import { round } from "lodash-es";
import { Check, X } from "lucide-react";

import { DateTime } from "~/components/date";
import { H2, H3 } from "~/components/header";
import { Outcome } from "~/components/outcome";
import type { SubmissionResult } from "~/lib/api/submission";

type Props = {
  submission: SubmissionResult;
  children: ReactNode;
};

export function PageClient({ submission, children }: Props) {
  const router = useRouter();

  const { t } = useLingui();

  useEffect(() => {
    if (isEvaluating(submission)) {
      const id = setInterval(() => router.refresh(), 500);
      return () => clearInterval(id);
    }
  }, [submission, router]);

  return (
    <div>
      <H2>
        <Trans>Sottoposizione {submission.id}</Trans>
      </H2>
      <H3 className="mb-2 mt-6">
        <Trans>Dettagli</Trans>
      </H3>
      <ul className="w-full rounded-box bg-base-200 p-2 *:p-2">
        <li>
          <span className="font-bold">
            <Trans>Esito:</Trans>
          </span>{" "}
          <Outcome submission={submission} />
        </li>
        <li>
          <span className="font-bold">
            <Trans>Linguaggio:</Trans>
          </span>{" "}
          {submission.language ?? "N/A"}
        </li>
        <li>
          <span className="font-bold">
            <Trans>Data e ora:</Trans>
          </span>{" "}
          <DateTime date={submission.timestamp} />
        </li>
      </ul>
      <div className="grid w-full auto-cols-auto overflow-x-auto max-md:w-screen max-md:-translate-x-4 max-md:px-4">
        {submission.scoreDetails?.map((subtask, i) => (
          <Fragment key={i}>
            <H3 className="col-span-5 m-2 mt-6 flex justify-between">
              {subtask.idx == null ? (
                <div>
                  <Trans>Testcases</Trans>
                </div>
              ) : (
                <div>
                  <Trans>Subtask {subtask.idx}</Trans>{" "}
                  {subtask.testcases.every((tc) => tc.outcome === "Correct") ? (
                    <Check
                      size={28}
                      className="inline text-success forced-colors:text-base-content"
                    />
                  ) : (
                    <X size={28} className="inline text-error forced-colors:text-base-content" />
                  )}
                </div>
              )}
              <div>
                {round(subtask.score, 2)} / {subtask.maxScore}
              </div>
            </H3>
            <SubtaskTable
              subtask={subtask}
              timeLimit={submission.timeLimit}
              memoryLimit={submission.memoryLimit}
            />
          </Fragment>
        ))}
      </div>
      <H3 className="mb-2 mt-6">
        <Trans>Compilazione</Trans>
      </H3>
      <ul className="w-full rounded-box bg-base-200 p-2 *:p-2">
        <li>
          <span className="font-bold">
            <Trans>Esito della compilazione:</Trans>
          </span>{" "}
          {submission.compilationOutcome || (
            <span className="inline-flex ml-2 gap-2 align-bottom">
              <span className="loading loading-spinner loading-xs" />{" "}
              <Trans>Compilazione in corso</Trans>
            </span>
          )}
        </li>
        <li>
          <span className="font-bold">
            <Trans>
              <abbr
                title={t`Tempo impiegato dalla fase di compilazione che precede l'esecuzione. Non è vincolato dal limite di tempo del problema e non influenza il punteggio.`}>
                Tempo di compilazione
              </abbr>
              :
            </Trans>
          </span>{" "}
          <Resource value={submission.compilationTime} unit="sec" precision={3} />
        </li>
        <li>
          <abbr className="font-bold">
            <Trans>
              <abbr
                title={t`Memoria utilizzata durante la fase di compilazione che precede l'esecuzione. Non è vincolata dal limite di memoria del problema e non influenza il punteggio.`}>
                Memoria utilizzata
              </abbr>
              :
            </Trans>
          </abbr>{" "}
          <Resource
            value={
              submission.compilationMemory != null ? submission.compilationMemory >> 20n : null
            }
            unit="MB"
          />
        </li>
        {submission.compilationStdout && (
          <li>
            <div className="mb-1 font-bold">
              <Trans>Standard output:</Trans>
            </div>
            <CompilationOutput>{submission.compilationStdout}</CompilationOutput>
          </li>
        )}
        {submission.compilationStderr && (
          <li>
            <div className="mb-1 font-bold">
              <Trans>Standard error:</Trans>
            </div>
            <CompilationOutput>{submission.compilationStderr}</CompilationOutput>
          </li>
        )}
      </ul>
      {children}
    </div>
  );
}

function CompilationOutput({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto whitespace-pre rounded-xl border border-base-content/10 bg-base-100 p-2 font-mono text-xs">
      {children}
    </div>
  );
}

type SubtaskProps = {
  subtask: NonNullable<SubmissionResult["scoreDetails"]>[number];
  timeLimit: number | null;
  memoryLimit: bigint | null;
};

function SubtaskTable({ subtask, timeLimit, memoryLimit }: SubtaskProps) {
  return (
    <div className="col-span-5 grid grid-cols-subgrid text-nowrap rounded-box bg-base-200 px-4 py-2 text-sm *:px-2 *:py-1">
      <Header>
        <Trans>Testcase</Trans>
      </Header>
      <Header>
        <Trans>Risultato</Trans>
      </Header>
      <Header>
        <Trans>Dettagli</Trans>
      </Header>
      <Header>
        <Trans>Tempo</Trans>
      </Header>
      <Header>
        <Trans>Memoria</Trans>
      </Header>
      {subtask.testcases.map((tc) => (
        <Fragment key={tc.idx}>
          <div className="font-mono">{tc.idx}</div>
          {tc.outcome === "Correct" ? (
            <div className="text-success">
              <Check className="inline" /> <Trans>Corretto</Trans>
            </div>
          ) : tc.outcome === "Partially correct" ? (
            <div className="text-warning">
              <Check className="inline" /> <Trans>Parzialmente corretto</Trans>
            </div>
          ) : (
            <div className="text-error">
              <X className="inline" /> <Trans>Errato</Trans>
            </div>
          )}
          <div className="min-w-40 text-wrap">{description(tc.text)}</div>
          <div>
            <Resource value={tc.time} limit={timeLimit} unit="sec" precision={3} />
          </div>
          <div>
            <Resource
              value={tc.memory != null ? BigInt(tc.memory) >> 20n : null}
              limit={memoryLimit}
              unit="MB"
            />
          </div>
        </Fragment>
      ))}
    </div>
  );
}

function Header({ children }: { children: ReactNode }) {
  return <div className="!py-2 text-sm font-bold opacity-60">{children}</div>;
}

function description(text: string) {
  if (text === "Execution timed out") {
    return "Time limit exceeded";
  }

  const signal = text.match(/Execution killed with signal (\d+)/)?.[1];

  switch (signal) {
    case "6":
      return "Assert failed (signal 6)";
    case "8":
      return "Division by zero (signal 8)";
    case "9":
      return "Memory limit exceeded (signal 9)";
    case "11":
      return "Runtime error (signal 11)";
    default:
      return text.replace(" (could be triggered by violating memory limits)", "");
  }
}

function isEvaluating(submission: SubmissionResult) {
  if (submission.compilationOutcome === null) return true;
  if (submission.compilationOutcome === "fail") return false;
  return submission.score === null;
}

type ResourceProps<T extends bigint | number> = {
  value: T | null;
  limit?: T | null;
  unit: string;
  precision?: T extends number ? number : never;
};

function Resource<T extends bigint | number>({ value, limit, unit, precision }: ResourceProps<T>) {
  if (value == null) return "N/A";

  const ratio = limit ? value / limit : 0;
  if (ratio > 1.0) {
    return <span className="text-error">{`> ${limit} ${unit}`}</span>;
  }

  return (
    <span className={clsx(ratio > 0.98 ? "text-error" : ratio > 0.75 && "text-warning")}>
      {Number(value).toFixed(precision)} {unit}
    </span>
  );
}
