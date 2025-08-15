import { getTask } from "~/lib/api/task";
import { loadLocale } from "~/lib/locale";

import { HelpDe } from "./de";
import { HelpEn } from "./en";
import { HelpEs } from "./es";
import { HelpFr } from "./fr";
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
      {i18n.locale === "it-IT" && <HelpIt io={task.io} taskType={task.taskType} />}
      {i18n.locale === "en-GB" && <HelpEn io={task.io} taskType={task.taskType} />}
      {i18n.locale === "de-DE" && <HelpDe io={task.io} taskType={task.taskType} />}
      {i18n.locale === "es-ES" && <HelpEs io={task.io} taskType={task.taskType} />}
      {i18n.locale === "fr-FR" && <HelpFr io={task.io} taskType={task.taskType} />}
    </>
  );
}
