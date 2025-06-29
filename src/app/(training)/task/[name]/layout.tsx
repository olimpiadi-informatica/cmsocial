import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Trans } from "@lingui/react/macro";

import { DateTime } from "~/components/date";
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
        <div className="grid md:grid-cols-2 gap-x-4 justify-center text-center w-max mx-auto">
          <div>
            <span className="font-bold">
              <Trans>Limite di tempo:</Trans>
            </span>{" "}
            {task.timeLimit ? `${task.timeLimit} sec` : "N/A"}
          </div>
          <div>
            <span className="font-bold">
              <Trans>Limite di memoria:</Trans>
            </span>{" "}
            {task.memoryLimit ? `${task.memoryLimit >> 20n} MB` : "N/A"}
          </div>
          <div>
            <span className="font-bold">
              <Trans>Input/output:</Trans>
            </span>{" "}
            {task.io}
          </div>
          <div>
            <span className="font-bold">
              <Trans>Punteggio massimo:</Trans>
            </span>{" "}
            {Math.round(task.scoreMultiplier * 100)}
          </div>
          <div>
            <span className="font-bold">
              <Trans>Traduzioni:</Trans>
            </span>{" "}
            <div className="inline-flex gap-1">
              {taskLocales.map((locale) => (
                <Flag key={locale} locale={locale} />
              ))}
            </div>
          </div>
          <div>
            <span className="font-bold">
              <Trans>Caricato il:</Trans>
            </span>{" "}
            <DateTime date={task.createdAt} dateStyle="long" timeStyle="hidden" />
          </div>
        </div>
      </header>
      <TaskTabs />
      {children}
    </div>
  );
}
