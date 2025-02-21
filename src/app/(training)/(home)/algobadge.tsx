import { Fragment } from "react";

import { path } from "d3-path";
import { Check, LockKeyhole, PencilLine } from "lucide-react";

export function Algobadge({ className }: { className?: string }) {
  const nodes = [
    { x: 2, y: 0, icon: "check" },
    { x: 0.5, y: 1.5, icon: "check" },
    { x: 2.5, y: 3, icon: "pencil" },
    { x: 0.5, y: 4.5, icon: "lock" },
    { x: 2, y: 5.7, icon: "" },
  ];

  const line = path();
  line.moveTo(nodes[0].x, nodes[0].y);
  for (let i = 1; i < nodes.length; i++) {
    line.bezierCurveTo(
      nodes[i - 1].x,
      nodes[i].y + 0.1,
      nodes[i].x,
      nodes[i - 1].y - 0.1,
      nodes[i].x,
      nodes[i].y,
    );
  }
  for (let i = 0; i < 2; i++) {
    const last = nodes.at(-1)!;
    line.moveTo(last.x, last.y + 0.15 + i * 0.35);
    line.lineTo(last.x, last.y + 0.35 + i * 0.35);
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -0.5 3 7"
      className={className}
      aria-hidden="true">
      <path
        d={line.toString()}
        strokeWidth={0.05}
        className="stroke-base-content"
        fillOpacity={0}
      />
      {nodes.map(({ x, y, icon }, i) => (
        <Fragment key={i}>
          {icon && (
            <circle
              cx={x}
              cy={y}
              r={0.4}
              strokeWidth={0.05}
              className="fill-base-200 stroke-base-content"
            />
          )}
          {icon === "check" && <Check x={x - 0.25} y={y - 0.25} size={0.5} />}
          {icon === "pencil" && <PencilLine x={x - 0.2} y={y - 0.2} size={0.4} />}
          {icon === "lock" && <LockKeyhole x={x - 0.2} y={y - 0.2} size={0.4} />}
        </Fragment>
      ))}
    </svg>
  );
}
