import { notFound } from "next/navigation";

import { Trans } from "@lingui/react/macro";

import { ForumPosts } from "~/components/forum-posts";
import { H2 } from "~/components/header";
import { getTask } from "~/lib/api/task";
import { loadLocale } from "~/lib/locale";

type Props = {
  params: Promise<{ name: string }>;
};

export default async function Page({ params }: Props) {
  const { name: taskName } = await params;

  await loadLocale();

  const task = await getTask(taskName);
  if (!task) notFound();

  return (
    <div>
      <H2 className="mb-2">
        <Trans>Discussioni del forum</Trans>
      </H2>
      <ForumPosts taskName={task.name} taskTitle={task.title} taskUrl={`/task/${taskName}`} />
    </div>
  );
}
