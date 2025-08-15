import { range } from "lodash-es";

import { getTags } from "~/lib/api/tags";
import { getTaskTags } from "~/lib/api/task-tags";
import { loadLocale } from "~/lib/locale";
import { getSessionUser, hasPermission } from "~/lib/user";

import { PageClient } from "./page-client";

type Props = {
  params: Promise<{ name: string }>;
};

export default async function Page({ params }: Props) {
  const { name } = await params;
  const i18n = await loadLocale();

  const sessionUser = await getSessionUser();
  const [taskTags, allTags, canAddTag] = await Promise.all([
    getTaskTags(name, sessionUser?.cmsId, i18n.locale),
    getTags(i18n.locale),
    hasPermission("tag", "add"),
  ]);

  const tagPlaceholders = range(16).map(() => Math.round(1e6 ** (Math.random() + 1)).toString());

  return (
    <PageClient
      taskTags={taskTags}
      allTags={allTags}
      canAddTag={canAddTag}
      tagPlaceholders={tagPlaceholders}
    />
  );
}
