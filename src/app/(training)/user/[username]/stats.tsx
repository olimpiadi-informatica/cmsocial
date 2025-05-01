import { Trans } from "@lingui/react/macro";
import { round } from "lodash-es";

import type { User } from "~/lib/api/user";
import { getSolvedCount, getSubmissionCount, getTotalEvaluationTime } from "~/lib/api/user-stats";

export async function Stats({ user }: { user: User }) {
  const [solved, submissions, totalTime] = await Promise.all([
    getSolvedCount(user.id, user.username),
    getSubmissionCount(user.id, user.username),
    getTotalEvaluationTime(user.id),
  ]);

  return (
    <div className="stats max-md:stats-vertical bg-transparent">
      <div className="stat place-items-center">
        <div className="stat-title">
          <Trans>Punti</Trans>
        </div>
        <div className="stat-value">{user.score}</div>
      </div>
      <div className="stat place-items-center">
        <div className="stat-title">
          <Trans>Problemi risolti</Trans>
        </div>
        <div className="stat-value">{solved}</div>
      </div>
      <div className="stat place-items-center">
        <div className="stat-title">
          <Trans>Sottoposizioni</Trans>
        </div>
        <div className="stat-value">{submissions}</div>
      </div>
      <div className="stat place-items-center">
        <div className="stat-title">
          <Trans>Tempo di esecuzione</Trans>
        </div>
        <div className="stat-value">{formatDuration(totalTime)}</div>
      </div>
    </div>
  );
}

function formatDuration(seconds: number) {
  const hours = round(seconds / 3600, 1);
  if (hours >= 1) return `${hours}h`;

  const minutes = round(seconds / 60, 1);
  if (minutes >= 1) return `${minutes}m`;

  return `${round(seconds, 1)}s`;
}
