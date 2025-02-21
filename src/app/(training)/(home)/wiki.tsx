import { BookOpenText, LibraryBig, UserRound } from "lucide-react";

export function Wiki({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2.5 2.5"
      className={className}
      aria-hidden="true">
      <LibraryBig x={1.5} y={0.1} size={0.8} strokeWidth={1.25} />
      <BookOpenText x={0.1} y={0.6} size={1} strokeWidth={1} />
      <UserRound x={0.5} y={1.1} size={1.4} strokeWidth={0.71} className="fill-base-200" />
    </svg>
  );
}
