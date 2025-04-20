"use client";

import { type ReactNode, useCallback } from "react";

import type { MessageDescriptor } from "@lingui/core";
import { useLingui } from "@lingui/react";
import { DropdownItem } from "@olinfo/react-components";
import clsx from "clsx";

type Props = {
  action: () => Promise<MessageDescriptor | undefined>;
  className?: string;
  active?: boolean;
  children: ReactNode;
};

export function DropdownAction({ action, className, active, children }: Props) {
  const { _ } = useLingui();

  const onClick = useCallback(async () => {
    const err = await action();
    if (err) throw new Error(_(err));
  }, [action, _]);

  return (
    <DropdownItem>
      <button className={clsx(active && "active", className)} onClick={onClick} type="button">
        {children}
      </button>
    </DropdownItem>
  );
}
