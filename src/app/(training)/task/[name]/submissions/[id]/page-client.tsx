"use client";

import { notFound } from "next/navigation";
import { Fragment, type ReactNode, useEffect, useState } from "react";

import { Trans } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { DateTime } from "@olinfo/react-components";
import {
  type SubmissionDetails,
  type Subtask,
  type Task,
  getSubmission,
  isEvaluating,
} from "@olinfo/training-api";
import clsx from "clsx";
import { Check, X } from "lucide-react";
import useSWR from "swr";

import { H2, H3 } from "~/components/header";
import { Outcome } from "~/components/outcome";

type Props = {
  task: Task;
  submission: SubmissionDetails;
  children: ReactNode;
};

export function PageClient({ task, submission: fallbackSubmission, children }: Props) {
  const { i18n } = useLingui();

  const [refreshInterval, setRefreshInterval] = useState<number>();
  const { data: submission } = useSWR(
    ["api/submission", fallbackSubmission.id],
    ([, id]) => getSubmission(id),
    { fallbackData: fallbackSubmission, refreshInterval },
  );
  if (!submission) notFound();

  useEffect(() => {
    if (submission && isEvaluating(submission)) {
      setRefreshInterval(1000);
    } else {
      setRefreshInterval(undefined);
    }
  }, [submission]);

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
          {submission.language}
        </li>
        <li>
          <span className="font-bold">
            <Trans>Data e ora:</Trans>
          </span>{" "}
          <DateTime date={submission.timestamp} locale={i18n.locale} />
        </li>
      </ul>
      <div className="grid w-full auto-cols-auto overflow-x-auto max-md:w-screen max-md:-translate-x-4 max-md:px-4">
        {submission.score_details?.map((subtask, i) => (
          <Fragment key={i}>
            <H3 className="col-span-5 m-2 mt-6 flex justify-between">
              {subtask.idx === undefined ? (
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
                {Math.round(subtask.score * 100) / 100} / {subtask.max_score}
              </div>
            </H3>
            <SubtaskTable
              subtask={subtask}
              timeLimit={task.time_limit}
              memoryLimit={task.memory_limit}
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
          {submission.compilation_outcome || (
            <span className="inline-flex gap-2 align-text-top">
              <span className="loading loading-spinner loading-xs" />{" "}
              <Trans>Compilazione in corso</Trans>
            </span>
          )}
        </li>
        <li>
          <span className="font-bold">
            <Trans>Tempo di compilazione:</Trans>
          </span>{" "}
          <Resource value={submission.compilation_time} unit="sec" precision={3} />
        </li>
        <li>
          <span className="font-bold">
            <Trans>Memoria utilizzata:</Trans>
          </span>{" "}
          <Resource
            value={submission.compilation_memory}
            unit="MB"
            multiplier={1 / (1 << 20)}
            precision={1}
          />
        </li>
        {submission.compilation_stdout && (
          <li>
            <div className="mb-1 font-bold">Standard output:</div>
            <CompilationOutput>{submission.compilation_stdout}</CompilationOutput>
          </li>
        )}
        {submission.compilation_stderr && (
          <li>
            <div className="mb-1 font-bold">Standard error:</div>
            <CompilationOutput>{submission.compilation_stderr}</CompilationOutput>
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
  subtask: Subtask;
  timeLimit?: number | null;
  memoryLimit?: number | null;
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
              value={tc.memory}
              limit={memoryLimit}
              unit="MB"
              multiplier={1 / (1 << 20)}
              precision={1}
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

type ResourceProps = {
  value: number | null;
  limit?: number | null;
  unit: string;
  multiplier?: number;
  precision?: number;
};

function Resource({ value, limit, unit, multiplier, precision }: ResourceProps) {
  if (value === null) return "N/A";

  const ratio = limit ? value / limit : 0;

  return (
    <span className={clsx(ratio > 0.98 ? "text-error" : ratio > 0.75 && "text-warning")}>
      {(value * (multiplier ?? 1)).toFixed(precision)} {unit}
    </span>
  );
}
