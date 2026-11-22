import { cache } from "react";

import { asc, eq } from "drizzle-orm";
import { groupBy, sortBy } from "es-toolkit";

import { cmsDb } from "~/lib/db";
import { socialUsers, taskBestTimes, tasks, users } from "~/lib/db/schema";

export type BestTimeTask = {
  name: string;
  title: string;
  time: number;
  tiedCount: number;
};

export type BestTimesUser = {
  id: number;
  username: string;
  name: string;
  image: string;
  tasks: BestTimeTask[];
};

export type BestTimesRanking = {
  users: BestTimesUser[];
  tiedTasks: BestTimeTask[];
};

export const getBestTimesRanking = cache(async (): Promise<BestTimesRanking> => {
  const records = await cmsDb
    .select({
      userId: users.id,
      username: users.username,
      name: socialUsers.name,
      image: socialUsers.image,
      taskName: tasks.name,
      taskTitle: tasks.title,
      time: taskBestTimes.time,
      tiedCount: taskBestTimes.tiedCount,
    })
    .from(taskBestTimes)
    .innerJoin(tasks, eq(tasks.id, taskBestTimes.taskId))
    .innerJoin(users, eq(users.id, taskBestTimes.userId))
    .innerJoin(socialUsers, eq(socialUsers.cmsId, users.id))
    .where(eq(tasks.contestId, Number(process.env.CMS_CONTEST_ID)))
    .orderBy(asc(taskBestTimes.time));

  const toTask = (r: (typeof records)[number]): BestTimeTask => ({
    name: r.taskName,
    title: r.taskTitle,
    time: r.time,
    tiedCount: r.tiedCount,
  });

  const byUser = groupBy(
    records.filter((r) => r.tiedCount === 1),
    (r) => r.userId,
  );
  const rankingUsers = Object.values(byUser).map((rows) => ({
    id: rows[0].userId,
    username: rows[0].username,
    name: rows[0].name,
    image: rows[0].image,
    tasks: rows.map(toTask).reverse(),
  }));

  return {
    users: sortBy(rankingUsers, [(u) => -u.tasks.length, (u) => u.username.toLowerCase()]),
    tiedTasks: records
      .filter((r) => r.tiedCount > 1)
      .map(toTask)
      .reverse(),
  };
});
