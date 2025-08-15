import { useLingui } from "@lingui/react/macro";
import clsx from "clsx";
import { round } from "lodash-es";
import {
  BookmarkCheck,
  BookmarkX,
  Gem,
  LockKeyhole,
  LockKeyholeOpen,
  type LucideIcon,
  Medal,
} from "lucide-react";

import { Link } from "~/components/link";
import {
  Badge,
  badgeStroke,
  bronzeScore,
  type Category,
  type CategoryBadge,
  diamondScore,
  goldScore,
  honorableScore,
  silverScore,
} from "~/lib/algobadge";

import style from "./header.module.css";

export function Header({ category, badge }: { category: Category; badge?: CategoryBadge }) {
  const { t } = useLingui();

  const maxScore = badge?.maxScore ?? 0;
  const score = badge?.badge === Badge.Locked ? 0 : (badge?.score ?? 0);

  const needed = [honorableScore, bronzeScore, silverScore, goldScore, diamondScore]
    .map((threshold) => threshold * maxScore - score)
    .filter((value) => value > 0)[0];

  return (
    <>
      <h1>{t(category.title)}</h1>
      <div className="flex flex-wrap justify-center gap-4 px-4 pb-8">
        {category.tasks.map((task) => {
          const url = task.terry ? `/task/terry/${task.name}` : `/task/${task.name}`;
          const score = badge?.tasks?.[task.name];
          const roundedScore = round(score ?? 0, 1);
          const maxScore = task.maxScore ?? 100;

          return (
            <Link
              key={task.name}
              href={url}
              className={clsx(
                "btn sm:btn-lg !h-auto pb-3 pt-2",
                roundedScore === maxScore && "btn-success",
                roundedScore > 0 && roundedScore < maxScore && "btn-warning",
                roundedScore === 0 && "btn-error",
              )}>
              <div className="*:mb-1">
                <div className="text-xl">{task.name}</div>
                <div className={clsx(score === undefined && "invisible")}>
                  {roundedScore} / {maxScore}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="mx-4">
        <div
          className="h-6 w-full tooltip tooltip-bottom before:max-w-96 before:text-lg before:rounded-lg [--tooltip-tail:0.5rem]"
          data-tip={
            needed === undefined
              ? t`Hai raggiunto il badge di diamante!`
              : t`Ti mancano ${needed} punti al badge successivo!`
          }>
          <div className="size-full overflow-hidden rounded-full bg-base-content/20">
            {badge && (
              <div
                className={clsx("h-full min-w-4", progress(badge.badge))}
                style={{ width: `${(score / maxScore) * 100}%` }}
              />
            )}
          </div>
        </div>
        <div className="relative mt-4 h-8 w-full">
          {category.hasHonorable ? (
            <>
              <Threshold color="stroke-error" score={0} icon={BookmarkX} />
              <Threshold
                color={badgeStroke[Badge.Honorable]}
                score={honorableScore}
                icon={BookmarkCheck}
              />
            </>
          ) : (
            <>
              <Threshold color="stroke-base-content" score={0} icon={LockKeyhole} />
              <Threshold
                color="stroke-base-content"
                score={honorableScore}
                icon={LockKeyholeOpen}
                size={32}
              />
            </>
          )}
          <Threshold color={badgeStroke[Badge.Bronze]} score={bronzeScore} />
          <Threshold color={badgeStroke[Badge.Silver]} score={silverScore} />
          <Threshold color={badgeStroke[Badge.Gold]} score={goldScore} />
          <Threshold color={badgeStroke[Badge.Diamond]} score={diamondScore} icon={Gem} />
        </div>
      </div>
      <hr />
    </>
  );
}

function progress(badge: Badge) {
  switch (badge) {
    case Badge.Honorable:
      return style.progressHonorable;
    case Badge.Bronze:
      return style.progressBronze;
    case Badge.Silver:
      return style.progressSilver;
    case Badge.Gold:
      return style.progressGold;
    case Badge.Diamond:
      return style.progressDiamond;
    default:
      return style.progressDefault;
  }
}

type ThresholdProps = {
  color: `stroke-${string}`;
  score: number;
  icon?: LucideIcon;
  size?: number;
};

function Threshold({ color, score, icon, size }: ThresholdProps) {
  const Icon = icon ?? Medal;
  return (
    <Icon
      className={clsx(
        "absolute -translate-x-1/2 first:translate-x-0 last:-translate-x-full",
        color,
        Icon === Medal && "last:*:hidden",
      )}
      size={size ?? 36}
      style={{ left: `${score * 100}%` }}
    />
  );
}
