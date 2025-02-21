"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import { msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import clsx, { type ClassValue } from "clsx";
import { clamp, range } from "lodash-es";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

type Props = {
  page: number;
  pageCount: number;
};

export function Pagination({ page, pageCount }: Props) {
  return (
    <>
      <SmallPagination page={page} pageCount={pageCount} />
      <LargePagination page={page} pageCount={pageCount} />
    </>
  );
}

function SmallPagination({ page, pageCount }: Props) {
  const middle = clamp(page, 3, pageCount - 2);
  const last = clamp(middle + 2, 1, pageCount) + 1;

  return (
    <div className="join w-full justify-center *:btn *:no-animation *:w-11 md:hidden">
      <PageButton page={page - 1} disabled={page <= 1} prefetch>
        <ChevronLeft size={20} />
      </PageButton>
      {range(middle - 2, last).map((i) => (
        <PageButton key={i} page={i} className={i === page && "!btn-active"}>
          {i}
        </PageButton>
      ))}
      <PageButton page={page + 1} disabled={page >= pageCount} prefetch>
        <ChevronRight size={20} />
      </PageButton>
    </div>
  );
}

function LargePagination({ page, pageCount }: Props) {
  const middle = clamp(page, 4, pageCount - 3);
  const last = clamp(middle + 3, 1, pageCount) + 1;

  return (
    <div className="join w-full justify-center *:btn *:no-animation *:w-14 max-md:hidden">
      <PageButton page={1} disabled={page <= 1}>
        <ChevronsLeft size={20} />
      </PageButton>
      <PageButton page={page - 1} disabled={page <= 1} prefetch>
        <ChevronLeft size={20} />
      </PageButton>
      {range(middle - 3, last).map((i) => (
        <PageButton key={i} page={i} className={i === page && "!btn-active"}>
          {i}
        </PageButton>
      ))}
      <PageButton page={page + 1} disabled={page >= pageCount} prefetch>
        <ChevronRight size={20} />
      </PageButton>
      <PageButton page={pageCount} disabled={page >= pageCount}>
        <ChevronsRight size={20} />
      </PageButton>
    </div>
  );
}

type ButtonProps = {
  page: number;
  disabled?: boolean;
  prefetch?: boolean;
  className?: ClassValue;
  children: ReactNode;
};

function PageButton({ page, disabled, prefetch, className, children }: ButtonProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { _ } = useLingui();

  const base = pathname.replace(/\/\d+$/, "");

  return disabled ? (
    <div className={clsx("btn-disabled join-item", className)}>{children}</div>
  ) : (
    <Link
      href={`${base}/${page}?${searchParams}`}
      className={clsx("join-item", className)}
      prefetch={!disabled && prefetch}
      aria-label={_(msg`Pagina ${page}`)}>
      {children}
    </Link>
  );
}
