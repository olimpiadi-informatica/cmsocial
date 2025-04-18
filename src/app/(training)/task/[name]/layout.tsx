import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Trans } from "@lingui/react/macro";

import { Flag } from "~/components/flags";
import { getTask, getTaskLocales } from "~/lib/api/task";
import { loadLocale } from "~/lib/locale";
import { TaskTabs } from "./tabs";

type Props = {
  params: Promise<{ name: string }>;
  children: ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;

  const task = await getTask(name);
  if (!task) return {};

  return {
    title: `Training - ${task.title}`,
    description: `Problemi ${task.title} (${task.name}) della piattaforma di allenamento delle Olimpiadi Italiane di Informatica`,
  };
}

export default async function Layout({ params, children }: Props) {
  const { name } = await params;
  await loadLocale();

  const task = await getTask(name);
  if (!task) notFound();

  const taskLocales = await getTaskLocales(name);

  return (
    <div className="flex grow flex-col gap-4">
      <header>
        <h1 className="text-center text-3xl font-bold">{task.title}</h1>
        <div className="flex flex-col items-center justify-center gap-x-2 sm:flex-row">
          <div>
            <Trans>Limite di tempo:</Trans> {task.timeLimit ? `${task.timeLimit} sec` : "N/A"}
          </div>
          <div className="max-sm:hidden">/</div>
          <div>
            <Trans>Limite di memoria:</Trans>{" "}
            {task.memoryLimit ? `${task.memoryLimit >> 20n} MB` : "N/A"}
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div>
            <Trans>Input/output:</Trans> {task.io}
          </div>
        </div>
        <div className="text-center">
          <Trans>Punteggio massimo:</Trans> {Math.round(task.scoreMultiplier * 100)}
        </div>
        <div className="text-center">
          <Trans>Traduzioni:</Trans>{" "}
          <div className="inline-flex gap-1">
            {taskLocales.map((locale) => (
              <Flag key={locale} locale={locale} />
            ))}
          </div>
        </div>
      </header>
      <TaskTabs />
      {children}
    </div>
  );
}
