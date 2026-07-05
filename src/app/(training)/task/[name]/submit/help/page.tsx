import { getTask } from "~/lib/api/task";
import { loadLocale } from "~/lib/locale";

const contents = import.meta.glob("./i18n-*.tsx", { eager: true, import: "default" }) as Record<
  string,
  ComponentType<{ io: string; taskType: string }>
>;

import type { ComponentType } from "react";

type Props = {
  params: Promise<{ name: string }>;
};

export default async function Page({ params }: Props) {
  const i18n = await loadLocale();
  const { name } = await params;

  const task = await getTask(name);
  if (!task) return;

  const Content = contents[`./i18n-${i18n.locale}.tsx`];
  return <Content io={task.io} taskType={task.taskType} />;
}
