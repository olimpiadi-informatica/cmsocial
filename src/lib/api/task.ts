import { cache } from "react";

import { and, eq, gte, like, min, or, sql } from "drizzle-orm";

import { getFile } from "~/lib/api/file";
import { cmsDb } from "~/lib/db";
import {
  attachments,
  type BatchParameters,
  type CommunicationParameters,
  contests,
  datasets,
  managers,
  participations,
  socialTasks,
  statements,
  type TaskType,
  taskScores,
  tasks,
  users,
} from "~/lib/db/schema";
import { fileLanguage, type Language, languageByName } from "~/lib/language";

import type { File } from "./file";

export type Task = {
  name: string;
  title: string;
  scoreMultiplier: number;
  submissionFormat: string[];
  timeLimit: number | null;
  memoryLimit: bigint | null;
  taskType: TaskType;
  createdAt: Date;
  io: "grader" | "output-only" | "stdin / stdout" | "file";
};

export const getTask = cache(async (name: string): Promise<Task | undefined> => {
  const [task] = await cmsDb
    .select({
      name: tasks.name,
      title: tasks.title,
      scoreMultiplier: socialTasks.scoreMultiplier,
      submissionFormat: tasks.submissionFormat,
      timeLimit: datasets.timeLimit,
      memoryLimit: datasets.memoryLimit,
      taskType: datasets.taskType,
      taskTypeParameters: datasets.taskTypeParameters,
      createdAt: socialTasks.createdAt,
    })
    .from(tasks)
    .innerJoin(socialTasks, eq(socialTasks.id, tasks.id))
    .innerJoin(datasets, eq(datasets.id, tasks.activeDatasetId))
    .where(eq(tasks.name, name))
    .limit(1);
  if (!task) return;

  let io: Task["io"];
  switch (task.taskType) {
    case "Batch": {
      const params = task.taskTypeParameters as BatchParameters;
      if (params[0] === "grader") {
        io = "grader";
      } else if (params[1][0] === "input.txt" || params[1][1] === "output.txt") {
        io = "file";
      } else {
        io = "stdin / stdout";
      }
      break;
    }
    case "Communication": {
      const params = task.taskTypeParameters as CommunicationParameters;
      io = params[1] === "stub" ? "grader" : "stdin / stdout";
      break;
    }
    case "OutputOnly":
      io = "output-only";
      break;
  }
  return { ...task, io };
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

export const getTaskStatement = cache(
  async (name: string, locale: string): Promise<File | undefined> => {
    const rows = await cmsDb
      .select({
        name: sql<string>`'testo.pdf'`,
        digest: statements.digest,
        url: getFile("testo.pdf", statements.digest),
      })
      .from(statements)
      .innerJoin(tasks, eq(tasks.id, statements.taskId))
      .where(eq(tasks.name, name))
      .orderBy(sql`CASE
                       WHEN ${eq(statements.language, locale)} THEN 0
                       WHEN ${statements.language} = ANY(${tasks.primaryStatements}) THEN 1
                       ELSE 2
                   END`)
      .limit(1);
    return rows[0];
  },
);

export const getTaskLocales = cache(async (name: string): Promise<string[]> => {
  const locales = await cmsDb
    .select({ locale: statements.language })
    .from(statements)
    .innerJoin(tasks, eq(tasks.id, statements.taskId))
    .where(eq(tasks.name, name));
  return locales.map((locale) => locale.locale);
});

export const getTaskLanguages = cache(async (name: string): Promise<Record<string, Language>> => {
  const [contest] = await cmsDb
    .select({ languages: contests.languages })
    .from(contests)
    .where(eq(contests.id, Number(process.env.CMS_CONTEST_ID)));
  const languages: [string, Language][] = contest.languages!.map((lang) => [
    lang,
    languageByName(lang)!,
  ]);

  const graders = await cmsDb
    .select({ filename: managers.filename })
    .from(managers)
    .innerJoin(tasks, eq(tasks.activeDatasetId, managers.datasetId))
    .where(
      and(
        eq(tasks.name, name),
        or(like(managers.filename, "grader.%"), like(managers.filename, "stub.%")),
      ),
    );

  if (graders.length === 0) {
    return Object.fromEntries(languages);
  }

  const graderLanguages = graders.map((grader) => fileLanguage(grader.filename));
  return Object.fromEntries(languages.filter(([_, lang]) => graderLanguages.includes(lang)));
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
