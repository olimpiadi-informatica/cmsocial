import clsx from "clsx";
import { clamp } from "lodash-es";

import { Link } from "~/components/link";
import type { UserScore } from "~/lib/api/user";

export function TaskBadge({ name, terry, title, score, maxScore }: UserScore) {
  const colors = [
    "bg-red-400 text-error-content",
    "bg-orange-400 text-warning-content",
    "bg-yellow-400 text-warning-content",
    "bg-lime-400 text-warning-content",
    "bg-green-400 text-success-content",
  ];

  const scoreFraction = clamp(score / maxScore, 0, 1);
  const color = colors[Math.floor(scoreFraction * 4)];

  return (
    <div className="my-1 inline-block w-full">
      <Link
        href={terry ? `/task/terry/${name}` : `/task/${name}`}
        className={clsx("inline-block rounded-lg px-2 py-0.5 text-sm", color)}>
        {title} <span className="align-text-bottom text-xs">({Math.round(score)})</span>
      </Link>
    </div>
  );
}
