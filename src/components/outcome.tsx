import { Trans } from "@lingui/react/macro";
import clsx from "clsx";

import type { Submission } from "~/lib/api/submissions";

export function Outcome({ submission }: { submission: Submission }) {
  if (submission.compilationOutcome === null) {
    return (
      <span className="inline-flex gap-2 align-bottom">
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
  if (submission.evaluationOutcome === null) {
    return (
      <span className="inline-flex gap-2 align-bottom">
        <span className="loading loading-spinner loading-xs" /> <Trans>Esecuzione in corso</Trans>
      </span>
    );
  }

  return <OutcomeScore score={submission.score!} />;
}

export function OutcomeScore({ score, maxScore }: { score: number; maxScore?: number }) {
  const colors = [
    "bg-red-400 text-error-content",
    "bg-orange-400 text-warning-content",
    "bg-yellow-400 text-warning-content",
    "bg-lime-400 text-warning-content",
    "bg-green-400 text-success-content",
  ];

  const scoreFraction = Math.min(Math.max(score / (maxScore ?? 100), 0), 1);
  const color = colors[Math.floor(scoreFraction * 4)];

  return (
    <span className={clsx("inline-block rounded-lg px-2 text-sm", color)}>
      {Math.round(score)} {maxScore && <>/ {maxScore}</>}
    </span>
  );
}
