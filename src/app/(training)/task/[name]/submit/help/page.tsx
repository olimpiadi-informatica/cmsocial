import { getTask } from "~/lib/api/task";
import { loadLocale } from "~/lib/locale";

import { HelpEn } from "./en";
import { HelpIt } from "./it";

type Props = {
  params: Promise<{ name: string }>;
};

export default async function Page({ params }: Props) {
  const i18n = await loadLocale();
  const { name } = await params;

  const task = await getTask(name);
  if (!task) return;

  return (
    <>
      {i18n.locale === "it" && <HelpIt io={task.io} taskType={task.taskType} />}
      {i18n.locale === "en" && <HelpEn io={task.io} taskType={task.taskType} />}
    </>
  );
}
