import { Fragment } from "react";

import { TZDate } from "@date-fns/tz";
import { useLingui } from "@lingui/react/macro";
import clsx from "clsx";
import {
  addDays,
  eachDayOfInterval,
  formatISO,
  intlFormat,
  isMonday,
  isSameMonth,
  startOfWeek,
  subWeeks,
  subYears,
} from "date-fns";
import { range } from "lodash-es";

import type { User } from "~/lib/api/user";
import { getSubmissionCountByDate } from "~/lib/api/user-stats";

const TZ = "Europe/Rome";

export async function ActivityGraph({ user }: { user: User }) {
  const { i18n } = useLingui();

  const to = new TZDate();
  const from = startOfWeek(subYears(to, 1), { locale: { options: { weekStartsOn: 1 } } });
  const dates = eachDayOfInterval({ start: from, end: to });

  const count = await getSubmissionCountByDate(user.id, user.username, from, to, TZ);

  const colors = [
    "bg-base-300",
    "bg-green-300 dark:bg-green-950",
    "bg-green-400 dark:bg-green-900",
    "bg-green-600 dark:bg-green-600",
    "bg-green-700 dark:bg-green-400",
    "bg-green-800 dark:bg-green-300",
    "bg-green-950 dark:bg-green-200",
  ];

  return (
    <div className="overflow-x-auto max-w-full mx-auto">
      <div className="grid grid-rows-8 grid-flow-col gap-0.5 overflow-hidden w-min px-4">
        <div />
        {range(7).map((i) => {
          const day = intlFormat(addDays(from, i), { weekday: "short" }, { locale: i18n.locale });
          return (
            <div key={i} className="text-end text-[0.5rem] text-base-content/80">
              {i % 2 === 0 && day}
            </div>
          );
        })}
        {dates.map((date) => {
          const isoDate = formatISO(date, { representation: "date" });
          const formattedDate = intlFormat(date, { dateStyle: "medium" }, { locale: i18n.locale });

          const level = count[isoDate]
            ? Math.min(Math.floor(Math.log2(count[isoDate]) / 2) + 1, colors.length - 1)
            : 0;

          const monday = isMonday(date);
          const month =
            monday &&
            !isSameMonth(date, subWeeks(date, 1)) &&
            intlFormat(date, { month: "short" }, { locale: i18n.locale });

          return (
            <Fragment key={isoDate}>
              {monday && <div className="text-[0.5rem] text-base-content/80 w-3">{month}</div>}
              <div
                className={clsx(
                  "tooltip size-3 rounded",
                  colors[level],
                  (date.getDay() + 6) % 7 < 3 && "tooltip-bottom",
                )}
                data-tip={formattedDate}
              />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
