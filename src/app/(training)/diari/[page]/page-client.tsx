"use client";

import { notFound, usePathname, useSearchParams } from "next/navigation";
import { useDeferredValue, useState, ViewTransition } from "react";

import { Trans, useLingui } from "@lingui/react/macro";
import { Menu } from "@olinfo/react-components";

import { H1 } from "~/components/header";
import { Link } from "~/components/link";
import { Pagination } from "~/components/pagination";
import type { DiarioItem } from "~/lib/diari";

export function PageClient({ diari }: { diari: DiarioItem[] }) {
  // useParams() does not update when using client-side navigation (e.g. window.history.pushState)
  const page = Number(usePathname().match(/^\/diari\/(\d+)/)?.[1]);
  const pageSize = 20;

  if (!Number.isInteger(page) || page < 1) notFound();

  const searchParams = useDeferredValue(useSearchParams());
  const { t } = useLingui();

  const filteredDiari = diari.filter((item) => isMatched(item, searchParams.get("search")));
  const pageCount = Math.max(Math.ceil(filteredDiari.length / pageSize), 1);
  if (page > pageCount) notFound();

  const pageDiari = filteredDiari.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <H1 className="px-2">
          <Trans>Pagina {page}</Trans>
        </H1>
        <Filter />
      </div>
      <Menu fallback={t`Nessun diario trovato`}>
        {pageDiari.map(({ contest, year, diario }) => (
          <ViewTransition key={diario.topicId}>
            <li>
              <Link href={`/diario/${contest}/${year}`} className="grid-cols-[1fr_auto]">
                <div>
                  {diario.name || contest.toUpperCase()} {year}
                  {diario.city && (
                    <span className="text-base-content/60 ml-2">({diario.city})</span>
                  )}
                </div>
              </Link>
            </li>
          </ViewTransition>
        ))}
      </Menu>
      <Pagination page={page} pageCount={pageCount} />
    </div>
  );
}

function Filter() {
  const searchParams = useSearchParams();
  const { t } = useLingui();

  const [push, setPush] = useState(true);

  const setFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (push) {
      window.history.pushState(null, "", `/diari/1?${newParams}`);
      setPush(false);
    } else {
      window.history.replaceState(null, "", `/diari/1?${newParams}`);
    }
  };

  return (
    <form role="search" onSubmit={(e) => e.preventDefault()}>
      <input
        className="input input-bordered"
        name="diario"
        type="search"
        placeholder={t`Nome del diario`}
        aria-label={t`Nome del diario`}
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => setFilter("search", e.target.value)}
        onBlur={() => setPush(true)}
      />
    </form>
  );
}

function isMatched(item: DiarioItem, search: string | null) {
  if (!search) return true;
  const q = search.toLowerCase();
  const name = item.diario.name?.toLowerCase() ?? "";
  const contest = item.contest.toLowerCase();
  const year = item.year.toLowerCase();
  const city = item.diario.city?.toLowerCase() ?? "";
  return (
    name.includes(q) ||
    contest.includes(q) ||
    year.includes(q) ||
    city.includes(q) ||
    `${name} ${year}`.includes(q) ||
    `${contest} ${year}`.includes(q)
  );
}
