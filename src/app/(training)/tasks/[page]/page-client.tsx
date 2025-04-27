"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { unstable_ViewTransition as ViewTransition, useDeferredValue } from "react";

import { Trans, useLingui } from "@lingui/react/macro";
import { Menu } from "@olinfo/react-components";
import clsx from "clsx";
import { range } from "lodash-es";
import { Search, X } from "lucide-react";
import useSWR from "swr";

import { H1 } from "~/components/header";
import { OutcomeScore } from "~/components/outcome";
import { Pagination } from "~/components/pagination";
import type { Tag } from "~/lib/api/tags";
import type { TaskItem, TaskListOptions } from "~/lib/api/tasks";

import { getTasks } from "./actions";
import { Filter } from "./filter";
import style from "./page.module.css";

type Props = {
  taskList: TaskItem[];
  taskCount: number;
  allTags: Tag[];
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
    order: searchParams.get("order") as "hardest" | "easiest" | "trending",
    unsolved: !!searchParams.get("unsolved"),
  };

  const {
    data: { taskList, taskCount },
  } = useSWR(["api/task-list", options, page, pageSize], ([, ...params]) => getTasks(...params), {
    fallbackData: props,
    keepPreviousData: true,
    revalidateOnFocus: false,
    revalidateOnMount: false,
  });
  const pageCount = Math.max(Math.ceil(taskCount / pageSize), 1);

  const taskListDeferred = useDeferredValue(taskList);

  return (
    <div className={clsx("flex flex-col gap-4", style.page)}>
      <div className="flex flex-wrap items-center justify-between sm:justify-center gap-4">
        <H1 className="px-2">
          <Trans>Pagina {page}</Trans>
        </H1>
        <label className="swap swap-rotate sm:hidden px-2">
          <input type="checkbox" className={style.searchToggle} defaultChecked />
          <Search className="swap-on" />
          <X className="swap-off" />
        </label>
      </div>
      <div className="flex gap-x-4 max-sm:flex-col-reverse">
        <div className="grow">
          <Menu fallback={t`Nessun problema trovato`}>
            {taskListDeferred.map((task) => (
              <ViewTransition key={task.id}>
                <li>
                  <Link href={`/task/${task.name}`} className="grid-cols-[auto_1fr_auto]">
                    <Difficulty difficulty={task.scoreMultiplier} />
                    {task.title}
                    {task.score != null && <OutcomeScore score={task.score} />}
                  </Link>
                </li>
              </ViewTransition>
            ))}
          </Menu>
        </div>
        <div className={clsx("shrink-0 sm:max-w-xs sm:w-1/3", style.filterContainer)}>
          <Filter allTags={props.allTags} />
        </div>
      </div>
      <Pagination page={page} pageCount={pageCount} />
    </div>
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
