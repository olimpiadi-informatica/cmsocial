import { getTasksByEvents } from "~/lib/api/events";
import { getOisYearTags } from "~/lib/api/tags";
import { loadLocale } from "~/lib/locale";
import { getSessionUser } from "~/lib/user";

import { OisTable } from "./table";

export default async function Page() {
  const i18n = await loadLocale();

  const user = await getSessionUser();

  const [tags, tasks] = await Promise.all([
    getOisYearTags(i18n.locale),
    getTasksByEvents(user?.cmsId, user?.username, ["ois"]),
  ]);

  const years = tags
    .map((tag) => ({
      tag: tag.name,
      year: Number(tag.name.slice(3)) + 2009,
      tasks: tasks.filter((t) => t.tags.includes(tag.name)),
    }))
    .filter(({ year }) => year !== 2009);

  return (
    <div className="relative -left-4">
      <OisTable years={years} />
    </div>
  );
}
