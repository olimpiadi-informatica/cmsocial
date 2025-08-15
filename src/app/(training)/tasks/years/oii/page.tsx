import { getTasksByEvents } from "~/lib/api/events";
import { getOiiYearTags } from "~/lib/api/tags";
import { loadLocale } from "~/lib/locale";
import { getSessionUser } from "~/lib/user";

import { OiiTable } from "./table";

export default async function Page() {
  const i18n = await loadLocale();

  const user = await getSessionUser();

  const [tags, tasks] = await Promise.all([
    getOiiYearTags(i18n.locale),
    getTasksByEvents(user?.cmsId, user?.username, ["territoriali", "pre-oii", "nazionali"]),
  ]);

  const years = tags
    .map((tag) => ({
      tag: tag.name,
      year: Number(tag.name.slice(3)),
      tasks: tasks.filter((t) => t.tags.includes(tag.name)),
    }))
    .filter(({ year }) => year !== 2009);

  return (
    <div className="relative -left-4">
      <OiiTable years={years} />
    </div>
  );
}
