"use client";

import NextLink from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

import { isString } from "es-toolkit";

export function Link(props: ComponentProps<typeof NextLink>) {
  const router = useRouter();

  const onMouseDown = () => {
    const href = isString(props.href) ? props.href : props.href.href;
    if (href) router.prefetch(href, { kind: "full" as any });
  };

  return <NextLink {...props} onTouchStart={onMouseDown} onMouseDown={onMouseDown} />;
}
