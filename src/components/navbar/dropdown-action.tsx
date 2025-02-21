"use client";

import { type ReactNode, useCallback } from "react";

import { DropdownItem } from "@olinfo/react-components";
import clsx from "clsx";

type Props = {
  action: () => Promise<string | undefined>;
  className?: string;
  active?: boolean;
  children: ReactNode;
};

export function DropdownAction({ action, className, active, children }: Props) {
  const onClick = useCallback(async () => {
    const err = await action();
    if (err) throw new Error(err);
  }, [action]);

  return (
    <DropdownItem>
      <button className={clsx(active && "active", className)} onClick={onClick} type="button">
        {children}
      </button>
    </DropdownItem>
  );
}
