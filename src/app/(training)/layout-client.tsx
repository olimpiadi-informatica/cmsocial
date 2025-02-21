"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import type { ReactNode } from "react";

import clsx from "clsx";

export function LayoutClient({ children }: { children: ReactNode }) {
  const segment = useSelectedLayoutSegment();

  return (
    <div
      className={clsx(
        "flex grow w-full flex-col",
        segment !== "(home)" && "mx-auto max-w-screen-xl p-4 pb-8",
      )}>
      {children}
    </div>
  );
}
