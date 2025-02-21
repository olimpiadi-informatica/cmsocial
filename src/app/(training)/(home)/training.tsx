import { Check, Laptop, Lightbulb, UserRound } from "lucide-react";

export function Training({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2 2"
      className={className}
      aria-hidden="true">
      <Lightbulb x={0.3} y={0.3} size={0.6} strokeWidth={1.3} />
      <UserRound x={0.1} y={0.9} size={1} strokeWidth={0.8} />
      <Laptop x={1.2} y={0.5} size={0.8} strokeWidth={1} />
      <Check x={1.45} y={0.72} size={0.3} strokeWidth={2.4} />
      {[-90, -45, 0, 45, 90].map((angle) => (
        <path
          key={angle}
          d="M0.6,0.1 L0.6,0.25"
          strokeWidth={0.04}
          className="stroke-base-content"
          transform={`rotate(${angle} 0.6 0.5)`}
        />
      ))}
    </svg>
  );
}
