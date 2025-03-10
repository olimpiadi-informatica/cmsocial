"use client";

import Link from "next/link";
import { notFound, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { Menu } from "@olinfo/react-components";

import { H1 } from "~/components/header";
import { OutcomeScore } from "~/components/outcome";
import { Pagination } from "~/components/pagination";
import type { TerryTaskItem } from "~/lib/api/tasks-terry";

export function PageClient({ tasks }: { tasks: TerryTaskItem[] }) {
  // useParams() does not update when using client-side navigation (e.g. window.history.pushState)
  const page = Number(usePathname().match(/^\/tasks\/terry\/(\d+)/)?.[1]);
  const pageSize = 20;

  if (!Number.isInteger(page) || page < 1) notFound();

  const searchParams = useSearchParams();
  const { _ } = useLingui();

  const filteredTasks = tasks.filter((t) => isMatched(t, searchParams.get("search")));
  const pageCount = Math.max(Math.ceil(filteredTasks.length / pageSize), 1);
  if (page > pageCount) notFound();

  const pageTasks = filteredTasks.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <H1 className="px-2">
          <Trans>Pagina {page}</Trans>
        </H1>
        <Filter />
      </div>
      <Menu fallback={_(msg`Nessun problema trovato`)}>
        {pageTasks.map((task) => (
          <li key={task.name}>
            <Link href={`/task/terry/${task.name}`} className="grid-cols-[1fr_auto]">
              <div>{task.title}</div>
              {task.score != null && <OutcomeScore score={task.score} maxScore={task.maxScore} />}
            </Link>
          </li>
        ))}
      </Menu>
      <Pagination page={page} pageCount={pageCount} />
    </div>
  );
}

function Filter() {
  const searchParams = useSearchParams();
  const { _ } = useLingui();

  const [push, setPush] = useState(true);

  const setFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (push) {
      window.history.pushState(null, "", `/tasks/terry/1?${newParams}`);
      setPush(false);
    } else {
      window.history.replaceState(null, "", `/tasks/terry/1?${newParams}`);
    }
  };

  return (
    <form role="search" onSubmit={(e) => e.preventDefault()}>
      <input
        className="input input-bordered"
        name="task"
        type="search"
        placeholder={_(msg`Nome del problema`)}
        aria-label={_(msg`Nome del problema`)}
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => setFilter("search", e.target.value)}
        onBlur={() => setPush(true)}
      />
    </form>
  );
}

function isMatched(task: { name: string; title: string }, search: string | null) {
  return (
    !search ||
    task.name.toLowerCase().includes(search.toLowerCase()) ||
    task.title.toLowerCase().includes(search.toLowerCase())
  );
}
