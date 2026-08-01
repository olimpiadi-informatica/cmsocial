"use client";

import { usePathname, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import { useLingui } from "@lingui/react/macro";
import clsx, { type ClassValue } from "clsx";
import { clamp, range } from "es-toolkit";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { Link } from "~/components/link";

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

function getPageRange(page: number, pageCount: number, maxPages: number) {
  if (pageCount <= maxPages) {
    return range(1, pageCount + 1);
  }
  const half = Math.floor(maxPages / 2);
  const start = clamp(page - half, 1, pageCount - maxPages + 1);
  return range(start, start + maxPages);
}

function SmallPagination({ page, pageCount }: Props) {
  return (
    <div className="join w-full justify-center *:btn *:no-animation *:w-11 md:hidden">
      <PageButton page={page - 1} disabled={page <= 1} prefetch>
        <ChevronLeft size={20} />
      </PageButton>
      {getPageRange(page, pageCount, 5).map((i) => (
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
  return (
    <div className="join w-full justify-center *:btn *:no-animation *:w-14 max-md:hidden">
      <PageButton page={1} disabled={page <= 1}>
        <ChevronsLeft size={20} />
      </PageButton>
      <PageButton page={page - 1} disabled={page <= 1} prefetch>
        <ChevronLeft size={20} />
      </PageButton>
      {getPageRange(page, pageCount, 7).map((i) => (
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
  const { t } = useLingui();

  const base = pathname.replace(/\/\d+$/, "");

  return disabled ? (
    <div className={clsx("btn-disabled join-item", className)}>{children}</div>
  ) : (
    <Link
      href={`${base}/${page}?${searchParams}`}
      className={clsx("join-item", className)}
      prefetch={!disabled && prefetch}
      aria-label={t`Pagina ${page}`}>
      {children}
    </Link>
  );
}
