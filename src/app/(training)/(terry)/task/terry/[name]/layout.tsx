import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getUser } from "@olinfo/terry-api";
import { getMe } from "@olinfo/training-api";

import { TaskTabs } from "./tabs";

type Props = {
  params: { name: string };
  children: ReactNode;
};

export async function generateMetadata({ params: { name } }: Props): Promise<Metadata> {
  const trainingUser = await getMe();
  if (!trainingUser) return {};

  const user = await getUser(trainingUser.username);
  const task = user.contest.tasks.find((t) => t.name === name);
  if (!task) return {};

  return {
    title: `Training - ${task.title}`,
    description: `Problemi ${task.title} (${task.name}) della piattaforma di allenamento delle Olimpiadi Italiane di Informatica`,
  };
}

export default async function Layout({ params: { name: taskName }, children }: Props) {
  const trainingUser = await getMe();
  if (!trainingUser) {
    redirect(`/login?redirect=${encodeURIComponent(`/task/terry/${taskName}`)}`);
  }

  const user = await getUser(trainingUser.username);
  const task = user.contest.tasks.find((t) => t.name === taskName);
  if (!task) notFound();

  return (
    <div className="flex grow flex-col gap-4">
      <h1 className="text-center text-3xl font-bold">{task.title}</h1>
      <TaskTabs />
      {children}
    </div>
  );
}
