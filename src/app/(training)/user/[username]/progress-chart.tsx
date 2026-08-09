"use client";

import { useMemo, useState } from "react";

import { Trans, useLingui } from "@lingui/react/macro";
import clsx from "clsx";
import { intlFormat } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ScoreProgressPoint } from "~/lib/api/user-stats";

type Props = {
  username: string;
  meUsername?: string;
  userData: ScoreProgressPoint[];
  meData?: ScoreProgressPoint[];
};

export function ProgressChart({ username, meUsername, userData, meData }: Props) {
  const { i18n, t } = useLingui();
  const [metric, setMetric] = useState<"score" | "rank">("score");
  const [showUser, setShowUser] = useState(true);
  const [showMe, setShowMe] = useState(false);

  const data = useMemo(() => {
    if (!showMe || !meData) {
      return userData.map((d) => ({
        date: d.date,
        score: d.score,
        rank: d.rank,
        meScore: undefined,
        meRank: undefined,
      }));
    }
    if (!showUser) {
      return meData.map((d) => ({
        date: d.date,
        score: undefined,
        rank: undefined,
        meScore: d.score,
        meRank: d.rank,
      }));
    }

    const mapUser = new Map(userData.map((d) => [d.date, d]));
    const mapMe = new Map(meData.map((d) => [d.date, d]));

    const allDates = [...new Set([...mapUser.keys(), ...mapMe.keys()])].sort();

    return allDates.map((date) => {
      const u = mapUser.get(date);
      const m = mapMe.get(date);
      return {
        date,
        score: u?.score,
        rank: u?.rank,
        meScore: m?.score,
        meRank: m?.rank,
      };
    });
  }, [showUser, showMe, userData, meData]);

  if (userData.length === 0 && (!meData || meData.length === 0)) {
    return (
      <div className="h-64 w-full flex items-center justify-center text-sm text-base-content/80">
        {t`Nessun progresso registrato`}
      </div>
    );
  }

  const isRank = metric === "rank";
  const userDataKey = isRank ? "rank" : "score";
  const meDataKey = isRank ? "meRank" : "meScore";

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
        {meUsername ? (
          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              type="button"
              onClick={() => setShowUser((prev) => !prev)}
              className={clsx(
                "flex items-center gap-1.5 cursor-pointer select-none transition-opacity",
                showUser ? "opacity-100" : "opacity-40 hover:opacity-70",
              )}>
              <div
                className={clsx(
                  "size-2.5 rounded-full",
                  showUser ? "bg-primary" : "bg-base-content/40",
                )}
              />
              <span className="text-base-content/90">{username}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowMe((prev) => !prev)}
              className={clsx(
                "flex items-center gap-1.5 cursor-pointer select-none transition-opacity",
                showMe ? "opacity-100" : "opacity-40 hover:opacity-70",
              )}>
              <div
                className={clsx(
                  "size-2.5 rounded-full",
                  showMe ? "bg-secondary" : "bg-base-content/40",
                )}
              />
              <span className="text-base-content/90">{meUsername}</span>
            </button>
          </div>
        ) : (
          <div />
        )}

        <div className="join">
          <button
            type="button"
            className={clsx(
              "btn btn-xs join-item",
              metric === "score" ? "btn-active btn-neutral" : "btn-ghost text-base-content/70",
            )}
            onClick={() => setMetric("score")}>
            <Trans>Punteggio</Trans>
          </button>
          <button
            type="button"
            className={clsx(
              "btn btn-xs join-item",
              metric === "rank" ? "btn-active btn-neutral" : "btn-ghost text-base-content/70",
            )}
            onClick={() => setMetric("rank")}>
            <Trans>Posizione</Trans>
          </button>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart key={metric} data={data} margin={{ top: 10, right: 16, left: 16, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreProgressGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(var(--p))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(var(--p))" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="meProgressGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(var(--s))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(var(--s))" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="oklch(var(--bc) / 0.1)" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              minTickGap={24}
              tick={{ fill: "oklch(var(--bc) / 0.7)", fontSize: 12 }}
              tickFormatter={(value: string) => {
                const date = new Date(value);
                return intlFormat(
                  date,
                  { month: "short", year: "2-digit" },
                  { locale: i18n.locale },
                );
              }}
            />
            <YAxis
              scale={isRank ? "log" : "auto"}
              domain={isRank ? [1, "dataMax"] : ["auto", "auto"]}
              reversed={isRank}
              allowDataOverflow={true}
              axisLine={false}
              tickLine={false}
              width={56}
              tick={{ fill: "oklch(var(--bc) / 0.7)", fontSize: 12 }}
              tickFormatter={(value: number) => (isRank ? `#${value}` : `${value}`)}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length || !label) return null;
                const formattedDate = intlFormat(
                  new Date(label),
                  { month: "long", year: "numeric" },
                  { locale: i18n.locale },
                );

                const userPayload = showUser
                  ? payload.find((p) => p.dataKey === userDataKey)
                  : undefined;
                const mePayload = showMe ? payload.find((p) => p.dataKey === meDataKey) : undefined;

                if (!userPayload && !mePayload) return null;

                const userVal = userPayload?.value;
                const meVal = mePayload?.value;

                return (
                  <div className="rounded-lg bg-base-200 border border-base-content/10 shadow-xl px-3 py-2 text-xs flex flex-col gap-1.5">
                    <div className="font-semibold capitalize">{formattedDate}</div>
                    <div className="flex flex-col gap-1">
                      {userPayload && userVal !== undefined && userVal !== null && (
                        <div className="flex items-center gap-2 text-base-content/80">
                          <div className="size-2 rounded-full bg-primary" />
                          <span>
                            {username}:{" "}
                            <span className="font-bold text-base-content">
                              {isRank ? `#${userVal}` : userVal}
                            </span>
                          </span>
                        </div>
                      )}
                      {mePayload && meVal !== undefined && meVal !== null && (
                        <div className="flex items-center gap-2 text-base-content/80">
                          <div className="size-2 rounded-full bg-secondary" />
                          <span>
                            {meUsername}:{" "}
                            <span className="font-bold text-base-content">
                              {isRank ? `#${meVal}` : meVal}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }}
            />
            {showUser && (
              <Area
                type="monotone"
                dataKey={userDataKey}
                name={username}
                stroke="oklch(var(--p))"
                strokeWidth={2}
                fill="url(#scoreProgressGrad)"
                dot={data.length <= 12 ? { r: 3, fill: "oklch(var(--p))" } : false}
                activeDot={{
                  r: 5,
                  fill: "oklch(var(--p))",
                  stroke: "oklch(var(--b1))",
                  strokeWidth: 2,
                }}
              />
            )}
            {showMe && (
              <Area
                type="monotone"
                dataKey={meDataKey}
                name={meUsername}
                stroke="oklch(var(--s))"
                strokeWidth={2}
                fill="url(#meProgressGrad)"
                dot={data.length <= 12 ? { r: 3, fill: "oklch(var(--s))" } : false}
                activeDot={{
                  r: 5,
                  fill: "oklch(var(--s))",
                  stroke: "oklch(var(--b1))",
                  strokeWidth: 2,
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
