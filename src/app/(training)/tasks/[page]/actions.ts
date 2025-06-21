"use server";

import { type TaskListOptions, getTaskCount, getTaskList } from "~/lib/api/tasks";
import { getSessionUser } from "~/lib/user";

export async function getTasks(options: TaskListOptions, page: number, pageSize: number) {
  const user = await getSessionUser();
  const [taskList, taskCount] = await Promise.all([
    getTaskList(options, user?.cmsId, page, pageSize),
    getTaskCount(options, user?.cmsId),
  ]);
  return {
    taskList,
    taskCount,
  };
}
