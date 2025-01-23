import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Trans } from "@lingui/macro";

import { getTask } from "~/lib/api/task";

import { TaskTabs } from "./tabs";

type Props = {
  params: { name: string };
  children: ReactNode;
};

export async function generateMetadata({ params: { name } }: Props): Promise<Metadata> {
  const task = await getTask(name);
  if (!task) return {};

  return {
    title: `Training - ${task.title}`,
    description: `Problemi ${task.title} (${task.name}) della piattaforma di allenamento delle Olimpiadi Italiane di Informatica`,
  };
}

export default async function Layout({ params: { name }, children }: Props) {
  const task = await getTask(name);
  if (!task) notFound();

  return (
    <div className="flex grow flex-col gap-4">
      <div>
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
        <div className="text-center">
          <Trans>Punteggio massimo:</Trans> {Math.round(task.scoreMultiplier * 100)}
        </div>
      </div>
      <TaskTabs />
      {children}
    </div>
  );
}
