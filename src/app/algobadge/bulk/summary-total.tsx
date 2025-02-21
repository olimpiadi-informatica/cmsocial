import { useMemo } from "react";

import { useLingui } from "@lingui/react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { type ExtendedBadge, type UserBadges, badgeColor, badgeName, badgeTypes } from "./common";
import { TooltipContent } from "./tooltip";

export function SummaryTotal({ users }: { users: UserBadges }) {
  const { _ } = useLingui();

  const data = useMemo(() => {
    const badges = Object.fromEntries(
      badgeTypes.map((badge) => [badge, { name: badge, value: 0 }]),
    );
    for (const user of Object.values(users)) {
      badges[user.totalBadge].value += 1;
    }

    return Object.values(badges).filter((badge) => badge.value > 0);
  }, [users]);

  return (
    <ResponsiveContainer height={300}>
      <PieChart className="outline-0">
        <Pie
          dataKey="value"
          data={data}
          outerRadius={80}
          className="[&_.recharts-pie-label-text]:fill-base-content"
          label>
          {data.map(({ name: badge }) => (
            <Cell
              key={badge}
              fill={badgeColor[badge]}
              stroke={badgeColor[badge]}
              className="outline-0"
            />
          ))}
        </Pie>
        <Tooltip
          content={TooltipContent}
          formatter={(value, badge) => [value, _(badgeName[badge as unknown as ExtendedBadge])]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
