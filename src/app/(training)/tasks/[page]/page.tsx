import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { compact } from "lodash-es";

import { type TaskListOptions, getTaskCount, getTaskList } from "~/lib/api/tasks";
import { getSessionUser } from "~/lib/user";

import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Training - Problemi",
  description:
    "Lista dei problemi della piattaforma di allenamento delle Olimpiadi Italiane di Informatica",
};

type Params = {
  params: {
    page: string;
  };
  searchParams: {
    search?: string;
    tag?: string | string[];
    order?: "hardest" | "easiest";
  };
};

export default async function Page({ params, searchParams }: Params) {
  const page = Number(params.page);
  const pageSize = 20;

  if (!Number.isInteger(page) || page < 1) notFound();

  const user = getSessionUser();

  const options: TaskListOptions = {
    search: searchParams.search,
    tags: compact(Array.isArray(searchParams.tag) ? searchParams.tag : [searchParams.tag]),
    order: searchParams.order,
  };

  const [taskList, taskCount] = await Promise.all([
    getTaskList(options, user?.id, page, pageSize),
    getTaskCount(options),
  ]);

  const pageCount = Math.max(Math.ceil(taskCount / pageSize), 1);
  if (page > pageCount) notFound();

  return <PageClient taskList={taskList} taskCount={taskCount} />;
}
