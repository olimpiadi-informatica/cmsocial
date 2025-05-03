"use client";

import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { type ComponentProps, useCallback } from "react";

import { isString } from "lodash-es";

export function Link(props: ComponentProps<typeof NextLink>) {
  const router = useRouter();

  const onMouseDown = useCallback(() => {
    const href = isString(props.href) ? props.href : props.href.href;
    if (href) router.prefetch(href);
  }, [props.href, router]);

  return <NextLink {...props} onTouchStart={onMouseDown} onMouseDown={onMouseDown} />;
}
