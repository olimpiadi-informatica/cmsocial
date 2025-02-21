import type { ReactNode } from "react";

import clsx from "clsx";

export function H1({ className, children }: { className?: string; children: ReactNode }) {
  return <h1 className={clsx("text-center text-2xl font-bold", className)}>{children}</h1>;
}

export function H2({ className, children }: { className?: string; children: ReactNode }) {
  return <h2 className={clsx("text-center text-xl font-bold", className)}>{children}</h2>;
}

export function H3({ className, children }: { className?: string; children: ReactNode }) {
  return <h3 className={clsx("text-center text-lg font-bold", className)}>{children}</h3>;
}
