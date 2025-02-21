"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Menu } from "@olinfo/react-components";
import { type TaskList, type TaskListOptions, getTaskList } from "@olinfo/training-api";
import clsx from "clsx";
import { range, sortBy } from "lodash-es";
import { X } from "lucide-react";
import useSWR from "swr";

import { H1 } from "~/components/header";
import { OutcomeScore } from "~/components/outcome";
import { Pagination } from "~/components/pagination";

export function PageClient(props: { taskList: TaskList }) {
  const { _ } = useLingui();

  // useParams() does not update when using client-side navigation (e.g. window.history.pushState)
  const page = Number(usePathname().match(/^\/tasks\/(\d+)/)?.[1]);
  const pageSize = 20;
  const options = Object.fromEntries(useSearchParams()) as TaskListOptions;

  const { data: taskList } = useSWR(
    ["api/tasks", page, pageSize, options],
    ([, ...params]) => getTaskList(...params),
    { fallbackData: props.taskList, keepPreviousData: true },
  );
  const { tasks, num, tags } = taskList;
  const pageCount = Math.max(Math.ceil(num / pageSize), 1);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <H1 className="px-2">
          <Trans>Pagina {page}</Trans>
        </H1>
        <Filter />
      </div>
      {tags?.length ? (
        <div className="flex flex-wrap gap-2">
          {sortBy(tags).map((tag) => (
            <Tag key={tag} tag={tag} allTags={tags} />
          ))}
        </div>
      ) : null}
      <Menu fallback={_(msg`Nessun problema trovato`)}>
        {tasks.map((task) => (
          <li key={task.id}>
            <Link href={`/task/${task.name}`} className="grid-cols-[auto_1fr_auto]">
              <Difficulty difficulty={task.score_multiplier} />
              {task.title}
              {task.score !== undefined && <OutcomeScore score={task.score} />}
            </Link>
          </li>
        ))}
      </Menu>
      <Pagination page={page} pageCount={pageCount} />
    </div>
  );
}

function Tag({ tag, allTags }: { tag: string; allTags: string[] }) {
  const searchParams = useSearchParams();
  const { _ } = useLingui();

  const newTags = allTags.filter((t) => t !== tag);
  const newParams = new URLSearchParams(searchParams);
  if (newTags.length === 0) {
    newParams.delete("tag");
  } else {
    newParams.set("tag", newTags.join(","));
  }

  return (
    <div className="badge badge-neutral flex h-6 gap-1">
      <Link href={`/tasks/1?${newParams}`} aria-label={_(msg`Rimuovi filtro ${tag}`)}>
        <X size={14} />
      </Link>
      {tag}
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
        placeholder={_(msg`Nome del problema`)}
        aria-label={_(msg`Nome del problema`)}
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => setFilter("search", e.target.value)}
        onBlur={() => setPush(true)}
        size={1}
      />
      <select
        className="join-item select select-bordered"
        aria-label={_(msg`Ordinamento`)}
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
