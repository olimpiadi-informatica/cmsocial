import { Fragment } from "react";

import type { DefaultTooltipContentProps } from "recharts";

export function TooltipContent({ payload, formatter }: DefaultTooltipContentProps<number, string>) {
  if (!payload?.length) return null;

  return (
    <div className="grid grid-cols-[repeat(3,auto)] gap-2 justify-between rounded-lg bg-base-200 border border-base-content/10 shadow-xl px-2.5 py-1.5 text-xs">
      {payload.toReversed().map((item, i) => {
        const formatted = formatter?.(item.value!, item.name!, item, i, payload) ?? item.value;
        const value = Array.isArray(formatted) ? formatted[0] : formatted;
        const name = Array.isArray(formatted) ? formatted[1] : item.name;

        return (
          <Fragment key={item.name}>
            <div className="h-full p-0.5">
              <div
                className="h-full aspect-square rounded"
                style={{
                  backgroundColor: item.color ?? item.payload.fill,
                  opacity: (item as any).fillOpacity,
                }}
              />
            </div>
            <div className="mr-12 text-base-content/80">{name}</div>
            <div>{value}</div>
          </Fragment>
        );
      })}
    </div>
  );
}
