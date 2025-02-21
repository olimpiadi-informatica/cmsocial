import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components, a };
}

function a({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return href ? (
    URL.canParse(href) ? (
      <a href={href} {...props} target="_blank" rel="noreferrer">
        {children}
      </a>
    ) : (
      <Link href={href} {...props}>
        {children}
      </Link>
    )
  ) : (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
