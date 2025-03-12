"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Trans, useLingui } from "@lingui/react/macro";
import { Menu } from "@olinfo/react-components";
import clsx from "clsx";
import { range } from "lodash-es";
import { X } from "lucide-react";
import useSWR from "swr";

import { H1 } from "~/components/header";
import { OutcomeScore } from "~/components/outcome";
import { Pagination } from "~/components/pagination";
import type { TaskItem, TaskListOptions } from "~/lib/api/tasks";

import { getTasks } from "./actions";

type Props = {
  taskList: TaskItem[];
  taskCount: number;
};

export function PageClient(props: Props) {
  const { t } = useLingui();

  // useParams() does not update when using client-side navigation (e.g. window.history.pushState)
  const page = Number(usePathname().match(/^\/tasks\/(\d+)/)?.[1]);
  const pageSize = 20;

  const searchParams = useSearchParams();
  const options: TaskListOptions = {
    search: searchParams.get("search"),
    tags: searchParams.getAll("tag"),
    order: searchParams.get("order") as "hardest" | "easiest",
    unsolved: !!searchParams.get("unsolved"),
  };

  const {
    data: { taskList, taskCount },
  } = useSWR(["api/task-list", options, page, pageSize], ([, ...params]) => getTasks(...params), {
    fallbackData: props,
    keepPreviousData: true,
  });
  const pageCount = Math.max(Math.ceil(taskCount / pageSize), 1);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <H1 className="px-2">
          <Trans>Pagina {page}</Trans>
        </H1>
        <Filter />
      </div>
      {options.tags?.length ? (
        <div className="flex flex-wrap gap-2">
          {options.tags.map((tag) => (
            <Tag key={tag} tag={tag} />
          ))}
        </div>
      ) : null}
      <Menu fallback={t`Nessun problema trovato`}>
        {taskList.map((task) => (
          <li key={task.id}>
            <Link href={`/task/${task.name}`} className="grid-cols-[auto_1fr_auto]">
              <Difficulty difficulty={task.scoreMultiplier} />
              {task.title}
              {task.score != null && <OutcomeScore score={task.score} />}
            </Link>
          </li>
        ))}
      </Menu>
      <Pagination page={page} pageCount={pageCount} />
    </div>
  );
}

function Tag({ tag }: { tag: string }) {
  const searchParams = useSearchParams();
  const { t } = useLingui();

  const newParams = new URLSearchParams(searchParams);
  newParams.delete("tag", tag);

  return (
    <div className="badge badge-neutral flex h-6 gap-1">
      <Link href={`/tasks/1?${newParams}`} aria-label={t`Rimuovi filtro ${tag}`}>
        <X size={14} />
      </Link>
      {tag}
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
      window.history.pushState(null, "", `/tasks/1?${newParams}`);
      setPush(false);
    } else {
      window.history.replaceState(null, "", `/tasks/1?${newParams}`);
    }
  };

  return (
    <form role="search" className="join max-w-full" onSubmit={(e) => e.preventDefault()}>
      <input
        className="input join-item input-bordered w-48"
        name="task"
        type="search"
        placeholder={t`Nome del problema`}
        aria-label={t`Nome del problema`}
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => setFilter("search", e.target.value)}
        onBlur={() => setPush(true)}
        size={1}
      />
      <select
        className="join-item select select-bordered"
        aria-label={t`Ordinamento`}
        defaultValue={searchParams.get("order") ?? ""}
        onChange={(e) => setFilter("order", e.target.value)}
        onBlur={() => setPush(true)}>
        <option value="">
          <Trans>Più recenti</Trans>
        </option>
        <option value="easiest">
          <Trans>Più facili</Trans>
        </option>
        <option value="hardest">
          <Trans>Più difficili</Trans>
        </option>
      </select>
    </form>
  );
}

function Difficulty({ difficulty }: { difficulty: number }) {
  const level = Math.round((Math.log10(difficulty) + 1) * 4.5);

  const colors = ["bg-green-400", "bg-lime-400", "bg-yellow-400", "bg-orange-400", "bg-red-400"];

  return (
    <div className="flex items-center">
      {range(10).map((i) => (
        <div
          key={i}
          className={clsx(
            "mask mask-star-2 h-4 w-2 forced-color-adjust-none odd:mask-half-1 even:mask-half-2 even:mr-0.5",
            i > level
              ? "[--tw-bg-opacity:0.2] forced-colors:bg-transparent"
              : "forced-colors:bg-base-content",
            colors[Math.floor(level / 2)],
          )}
        />
      ))}
    </div>
  );
}
