import { and, arrayOverlaps, eq, inArray, sql } from "drizzle-orm";
import { cache } from "react";

import { cmsDb, terryDb } from "~/lib/db";
import { participations, tasks } from "~/lib/db/schema-cms";
import { tags, taskScores, taskTags } from "~/lib/db/schema-cmsocial";
import { terryTasks, terryUserTasks } from "~/lib/db/schema-terry";

export type TaskItem = {
  name: string;
  terry: boolean;
  title: string;
  score: number | null;
  maxScore: number;
  tags: string[];
};

const terryTasksByYear: Record<string, string[]> = {
  ioi2026: ["spegnitutto", "abbassatutto", "investitutto", "espanditutto"],
  ioi2025: ["cioccolato", "calcolatrice", "superluigi", "guadagni"],
  ioi2024: ["rettangolo", "newlines", "muro", "quadrante"],
  ioi2023: ["fossili", "fortuna", "vacanze", "finestrini"],
  ioi2022: ["pile", "collezionismo", "ostacoli", "palindromo"],
  ioi2021: ["pesci", "social", "mostra", "interruttori"],
  ioi2020: ["download", "tornello", "gerarchie", "multicore"],
  ioi2019: ["party", "antivirus", "xray", "escursione"],
};

async function getTerryTasksByYear(username: string | undefined): Promise<TaskItem[]> {
  const tasks = await terryDb
    .select({
      name: terryTasks.name,
      title: terryTasks.title,
      score: terryUserTasks.score,
      maxScore: terryTasks.maxScore,
      terry: sql`1`.mapWith(Boolean),
    })
    .from(terryTasks)
    .leftJoin(
      terryUserTasks,
      username
        ? and(eq(terryUserTasks.task, terryTasks.name), eq(terryUserTasks.token, username))
        : sql<boolean>`FALSE`,
    )
    .where(inArray(terryTasks.name, Object.values(terryTasksByYear).flat()))
    .orderBy(terryTasks.num);

  return tasks.map((task) => {
    const year = Object.entries(terryTasksByYear)
      .filter(([, tasks]) => tasks.includes(task.name))
      .map(([year]) => year);

    return {
      ...task,
      tags: ["territoriali", ...year],
    };
  });
}

function getTasksByTags(userId: number | undefined, tagNames: string[]): Promise<TaskItem[]> {
  const tagsSq = cmsDb
    .select({
      taskId: taskTags.taskId,
      tags: sql<string[]>`ARRAY_AGG(${tags.name})`.as("tags"),
    })
    .from(taskTags)
    .innerJoin(tags, eq(tags.id, taskTags.tagId))
    .groupBy(taskTags.taskId)
    .as("tags_sq");

  const scoreSq = cmsDb
    .select({
      taskId: taskScores.taskId,
      userId: participations.userId,
      score: taskScores.score,
    })
    .from(taskScores)
    .innerJoin(participations, eq(participations.id, taskScores.participationId))
    .as("score_sq");

  const query = cmsDb
    .select({
      name: tasks.name,
      title: tasks.title,
      score: userId ? scoreSq.score : sql<null>`NULL`,
      maxScore: sql<number>`100`,
      terry: sql<boolean>`FALSE`,
      tags: tagsSq.tags,
    })
    .from(tasks)
    .innerJoin(tagsSq, eq(tagsSq.taskId, tasks.id))
    .where(arrayOverlaps(tagsSq.tags, sql`ARRAY[${sql.join(tagNames, sql`,`)}]::varchar[]`))
    .orderBy(tasks.num);

  if (userId) {
    return query.leftJoin(scoreSq, and(eq(scoreSq.taskId, tasks.id), eq(scoreSq.userId, userId)));
  }

  return query;
}

export const getTasksByEvents = cache(
  async (
    userId: number | undefined,
    username: string | undefined,
    events: string[],
  ): Promise<TaskItem[]> => {
    const [terryTasks, cmsTasks] = await Promise.all([
      events.includes("territoriali") ? getTerryTasksByYear(username) : [],
      getTasksByTags(userId, events),
    ]);
    return [...terryTasks, ...cmsTasks];
  },
);
