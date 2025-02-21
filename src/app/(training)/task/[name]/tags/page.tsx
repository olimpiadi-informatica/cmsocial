import { notFound } from "next/navigation";

import { getEventTags, getMe, getTags, getTask } from "@olinfo/training-api";
import { range } from "lodash-es";

import { PageClient } from "./page-client";

type Props = {
  params: { name: string };
};

export default async function Page({ params: { name } }: Props) {
  const [user, task, tags, eventTags] = await Promise.all([
    getMe(),
    getTask(name),
    getTags(),
    getEventTags(),
  ]);
  if (!task) notFound();

  const tagPlaceholders = range(10).map(() => Math.round(1e6 ** (Math.random() + 1)).toString());

  return (
    <PageClient
      task={task}
      tags={tags}
      eventTags={eventTags}
      isLogged={!!user}
      tagPlaceholders={tagPlaceholders}
    />
  );
}
