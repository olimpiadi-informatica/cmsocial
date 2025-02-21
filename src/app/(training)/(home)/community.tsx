import { MessageSquareText, UserRound } from "lucide-react";

export function Community({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2.5 2.5"
      className={className}
      aria-hidden="true">
      <MessageSquareText x={1.5} y={0.3} size={0.8} strokeWidth={1.25} />
      <UserRound x={1.1} y={1} size={1} strokeWidth={1} />
      <UserRound x={0.1} y={1.5} size={1} strokeWidth={1} />
      <UserRound x={0.3} y={0.5} size={1} strokeWidth={1} />
    </svg>
  );
}
