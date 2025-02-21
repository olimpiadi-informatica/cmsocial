import { useMemo } from "react";

import { useLingui } from "@lingui/react";
import { mapValues, omitBy, pull } from "lodash-es";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge, type CategoryId, algobadge } from "~/lib/algobadge";

import { type ExtendedBadge, type UserBadges, badgeColor, badgeName, badgeTypes } from "./common";
import { TooltipContent } from "./tooltip";

type DataEntry = { name: CategoryId } & { [key in ExtendedBadge]?: number };
type Data = DataEntry[];

export function SummaryCategories({ users }: { users: UserBadges }) {
  const { _ } = useLingui();

  const data = useMemo((): Data => {
    const badges = mapValues(
      algobadge,
      (_category, id): DataEntry => ({
        name: id as CategoryId,
        ...Object.fromEntries(badgeTypes.map((badge) => [badge, 0])),
      }),
    );

    for (const user of Object.values(users)) {
      if (user.totalBadge <= Badge.Diamond) {
        for (const [name, value] of Object.entries(user.badges)) {
          badges[name as CategoryId][value.badge]! += 1;
        }
      } else {
        for (const badge of Object.values(badges)) {
          badge[user.totalBadge]! += 1;
        }
      }
    }

    return Object.values(badges).map(
      (badges) => omitBy(badges, (value) => value === 0) as DataEntry,
    );
  }, [users]);

  return (
    <ResponsiveContainer height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" axisLine={false} tickLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <CartesianGrid vertical={false} stroke="oklch(var(--bc) / 0.1)" />
        <Tooltip
          cursor={{ fill: "oklch(var(--bc) / 0.1)" }}
          content={TooltipContent}
          formatter={(value, badge) => [value, _(badgeName[badge as unknown as ExtendedBadge])]}
        />
        {badgeTypes.map((badge) => (
          <Bar
            key={badge}
            type="monotone"
            dataKey={badge}
            stackId="1"
            stroke={badgeColor[badge]}
            fill={badgeColor[badge]}>
            {data.map((item) => {
              const itemKeys = pull(Object.keys(item), "name");
              const pos = itemKeys.indexOf(badge.toString());

              const radius = [0, 0, 0, 0];
              if (pos === 0) {
                radius[2] = radius[3] = 8;
              }
              if (pos === itemKeys.length - 1) {
                radius[0] = radius[1] = 8;
              }

              return <Cell key={item.name} radius={radius as any} />;
            })}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
