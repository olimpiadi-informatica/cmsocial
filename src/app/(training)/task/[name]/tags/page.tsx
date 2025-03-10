import { range } from "lodash-es";

import { getTags } from "~/lib/api/tags";
import { getTaskTags } from "~/lib/api/task-tags";
import { getUser } from "~/lib/api/user";
import { getSessionUser } from "~/lib/user";

import { PageClient } from "./page-client";

type Props = {
  params: Promise<{ name: string }>;
};

export default async function Page({ params }: Props) {
  const { name } = await params;

  const sessionUser = await getSessionUser();
  const [user, taskTags, tags] = await Promise.all([
    getUser(sessionUser?.username),
    getTaskTags(name, sessionUser?.id),
    getTags(),
  ]);

  const tagPlaceholders = range(16).map(() => Math.round(1e6 ** (Math.random() + 1)).toString());

  return (
    <PageClient taskTags={taskTags} tags={tags} user={user} tagPlaceholders={tagPlaceholders} />
  );
}
