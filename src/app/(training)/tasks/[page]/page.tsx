import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { compact, uniq } from "lodash-es";

import { getTechniqueTags } from "~/lib/api/tags";
import { getTaskCount, getTaskList, type TaskListOptions } from "~/lib/api/tasks";
import { loadLocale } from "~/lib/locale";
import { getSessionUser } from "~/lib/user";

import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Training - Problemi",
  description:
    "Lista dei problemi della piattaforma di allenamento delle Olimpiadi Italiane di Informatica",
};

type Params = {
  params: Promise<{
    page: string;
  }>;
  searchParams: Promise<{
    search?: string;
    tag?: string | string[];
    order?: "hardest" | "easiest";
    unsolved?: string;
  }>;
};

export default async function Page({ params, searchParams }: Params) {
  const { search, tag, order, unsolved } = await searchParams;
  const page = Number((await params).page);
  const pageSize = 20;

  if (!Number.isInteger(page) || page < 1) notFound();

  const i18n = await loadLocale();
  const user = await getSessionUser();

  const options: TaskListOptions = {
    search: search,
    tags: compact(Array.isArray(tag) ? uniq(tag) : [tag]),
    order: order,
    unsolved: !!unsolved,
  };

  const [taskList, taskCount, allTags] = await Promise.all([
    getTaskList(options, user?.cmsId, page, pageSize),
    getTaskCount(options, user?.cmsId),
    getTechniqueTags(i18n.locale),
  ]);

  const pageCount = Math.max(Math.ceil(taskCount / pageSize), 1);
  if (page > pageCount) notFound();

  return <PageClient taskList={taskList} taskCount={taskCount} allTags={allTags} />;
}
