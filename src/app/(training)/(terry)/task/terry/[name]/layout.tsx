import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { type ReactNode, unstable_ViewTransition as ViewTransition } from "react";

import { getTerryTask } from "~/lib/api/task-terry";

import { TaskTabs } from "./tabs";

type Props = {
  params: Promise<{ name: string }>;
  children: ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;

  const task = await getTerryTask(name);
  if (!task) return {};

  return {
    title: `Training - ${task.title}`,
    description: `Problemi ${task.title} (${task.name}) della piattaforma di allenamento delle Olimpiadi Italiane di Informatica`,
  };
}

export default async function Layout({ params, children }: Props) {
  const { name: taskName } = await params;

  const task = await getTerryTask(taskName);
  if (!task) notFound();

  return (
    <div className="flex grow flex-col gap-4">
      <header>
        <h1 className="text-center text-3xl font-bold">{task.title}</h1>
      </header>
      <TaskTabs />
      <ViewTransition>{children}</ViewTransition>
    </div>
  );
}
