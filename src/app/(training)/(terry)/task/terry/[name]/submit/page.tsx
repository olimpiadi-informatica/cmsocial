import { notFound } from "next/navigation";

import { getUser } from "@olinfo/terry-api";
import { getMe } from "@olinfo/training-api";

import { PageClient } from "./page-client";

type Props = {
  params: { name: string };
};

export default async function Page({ params: { name: taskName } }: Props) {
  const trainingUser = await getMe();
  if (!trainingUser) return null;

  const user = await getUser(trainingUser.username);
  const task = user.contest.tasks.find((t) => t.name === taskName);
  if (!task) notFound();

  return <PageClient user={user} task={task} />;
}
