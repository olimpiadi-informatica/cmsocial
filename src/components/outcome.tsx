import { Trans } from "@lingui/react/macro";
import clsx from "clsx";
import { clamp, round } from "lodash-es";

import type { SubmissionResult } from "~/lib/api/submission";
import type { Submission } from "~/lib/api/submissions";

export function Outcome({ submission }: { submission: Submission | SubmissionResult }) {
  if (
    (submission.compilationOutcome === null && (submission.compilationTries ?? 0) >= 3) ||
    (submission.evaluationOutcome === null && (submission.evaluationTries ?? 0) >= 3)
  ) {
    return (
      <span className="inline-block rounded-lg bg-error px-2 text-sm text-error-content">
        <Trans>Errore del server</Trans>
      </span>
    );
  }
  if (submission.compilationOutcome === null) {
    return (
      <span className="inline-flex ml-2 gap-2 align-bottom">
        <span className="loading loading-spinner loading-xs" /> <Trans>Compilazione in corso</Trans>
      </span>
    );
  }
  if (submission.compilationOutcome === "fail") {
    return (
      <span className="inline-block rounded-lg bg-error px-2 text-sm text-error-content">
        <Trans>Compilazione fallita</Trans>
      </span>
    );
  }
  if (submission.evaluationOutcome === null || submission.score === null) {
    return (
      <span className="inline-flex ml-2 gap-2 align-bottom">
        <span className="loading loading-spinner loading-xs" /> <Trans>Esecuzione in corso</Trans>
        {"evaluationsCount" in submission && submission.evaluationsCount > 0 && (
          <span className="text-base-content/80">
            {" "}
            ({Math.round((submission.evaluationsCount / submission.testcaseCount) * 100)}%)
          </span>
        )}
      </span>
    );
  }

  return <OutcomeScore score={submission.score} />;
}

export function OutcomeScore({ score, maxScore }: { score: number; maxScore?: number }) {
  const colors = [
    "bg-red-400 text-error-content",
    "bg-orange-400 text-warning-content",
    "bg-yellow-400 text-warning-content",
    "bg-lime-400 text-warning-content",
    "bg-green-400 text-success-content",
  ];

  const scoreFraction = clamp(round(score, 1) / (maxScore ?? 100), 0, 1);
  const color = colors[Math.floor(scoreFraction * 4)];

  return (
    <span className={clsx("inline-block rounded-lg px-2 text-sm", color)}>
      {Math.round(score)} {maxScore && <>/ {maxScore}</>}
    </span>
  );
}
