import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { getTerryTask } from "~/lib/api/task-terry";

import { TaskTabs } from "./tabs";

type Props = {
  params: { name: string };
  children: ReactNode;
};

export async function generateMetadata({ params: { name } }: Props): Promise<Metadata> {
  const task = await getTerryTask(name);
  if (!task) return {};

  return {
    title: `Training - ${task.title}`,
    description: `Problemi ${task.title} (${task.name}) della piattaforma di allenamento delle Olimpiadi Italiane di Informatica`,
  };
}

export default async function Layout({ params: { name: taskName }, children }: Props) {
  const task = await getTerryTask(taskName);
  if (!task) notFound();

  return (
    <div className="flex grow flex-col gap-4">
      <h1 className="text-center text-3xl font-bold">{task.title}</h1>
      <TaskTabs />
      {children}
    </div>
  );
}
