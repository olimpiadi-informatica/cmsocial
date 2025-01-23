import { range } from "lodash-es";

import { getTags, getTaskTags } from "~/lib/api/tags";
import { getSessionUser } from "~/lib/user";

import { PageClient } from "./page-client";

type Props = {
  params: { name: string };
};

export default async function Page({ params: { name } }: Props) {
  const user = getSessionUser();
  const [taskTags, tags] = await Promise.all([getTaskTags(name, user?.id), getTags()]);

  const tagPlaceholders = range(16).map(() => Math.round(1e6 ** (Math.random() + 1)).toString());

  return (
    <PageClient
      taskTags={taskTags}
      tags={tags}
      isLogged={!!user}
      tagPlaceholders={tagPlaceholders}
    />
  );
}
