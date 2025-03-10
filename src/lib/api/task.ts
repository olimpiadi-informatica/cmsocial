import { cache } from "react";

import { and, eq, gte, min, sql } from "drizzle-orm";

import { getFile } from "~/lib/api/file";
import { cmsDb } from "~/lib/db";
import {
  attachments,
  datasets,
  participations,
  socialTasks,
  statements,
  taskScores,
  tasks,
  users,
} from "~/lib/db/schema";

import type { File } from "./file";

export type Task = {
  name: string;
  title: string;
  scoreMultiplier: number;
  submissionFormat: string[];
  timeLimit: number | null;
  memoryLimit: bigint | null;
  taskType: "Batch" | "OutputOnly";
};

export const getTask = cache(async (name: string): Promise<Task | undefined> => {
  const rows = await cmsDb
    .select({
      name: tasks.name,
      title: tasks.title,
      scoreMultiplier: socialTasks.scoreMultiplier,
      submissionFormat: tasks.submissionFormat,
      timeLimit: datasets.timeLimit,
      memoryLimit: datasets.memoryLimit,
      taskType: datasets.taskType,
    })
    .from(tasks)
    .innerJoin(socialTasks, eq(socialTasks.id, tasks.id))
    .innerJoin(datasets, eq(datasets.id, tasks.activeDatasetId))
    .where(eq(tasks.name, name))
    .limit(1);
  return rows[0];
});

export const getTaskAttachments = cache((name: string): Promise<File[]> => {
  return cmsDb
    .select({
      name: attachments.filename,
      digest: attachments.digest,
      url: getFile(attachments.filename, attachments.digest),
    })
    .from(attachments)
    .innerJoin(tasks, eq(tasks.id, attachments.taskId))
    .where(eq(tasks.name, name))
    .orderBy(attachments.filename);
});

export const getTaskStatement = cache(async (name: string, locale: string): Promise<File> => {
  const rows = await cmsDb
    .select({
      name: sql<string>`'testo.pdf'`,
      digest: statements.digest,
      url: getFile("testo.pdf", statements.digest),
    })
    .from(statements)
    .innerJoin(tasks, eq(tasks.id, statements.taskId))
    .where(eq(tasks.name, name))
    .orderBy(sql`CASE WHEN ${eq(statements.language, locale)} THEN 0 ELSE 1 END`)
    .limit(1);
  return rows[0];
});

export type TaskStats = {
  subCount: number;
  correctSubCount: number;
  userCount: number;
  correctUserCount: number;
  topUsers: {
    username: string;
    time: number | null;
  }[];
};

export const getTaskStats = cache(async (name: string): Promise<TaskStats | undefined> => {
  const [stats] = await cmsDb
    .select({
      subCount: socialTasks.subCount,
      correctSubCount: socialTasks.correctSubCount,
      userCount: socialTasks.userCount,
      correctUserCount: socialTasks.correctUserCount,
    })
    .from(tasks)
    .innerJoin(socialTasks, eq(socialTasks.id, tasks.id))
    .where(eq(tasks.name, name))
    .limit(1);
  if (!stats) return;

  const topUsers = await cmsDb
    .select({
      username: users.username,
      time: min(taskScores.time),
    })
    .from(taskScores)
    .innerJoin(tasks, eq(tasks.id, taskScores.taskId))
    .innerJoin(participations, eq(participations.id, taskScores.participationId))
    .innerJoin(users, eq(users.id, participations.userId))
    .where(and(eq(tasks.name, name), gte(taskScores.score, 100), eq(participations.hidden, false)))
    .groupBy(users.username)
    .orderBy((c) => c.time)
    .limit(10);
  return {
    ...stats,
    topUsers,
  };
});
