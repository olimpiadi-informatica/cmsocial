import { notFound } from "next/navigation";

import { Trans } from "@lingui/macro";
import { getUser } from "@olinfo/terry-api";

import { getMe } from "@olinfo/training-api";
import { ForumPosts } from "~/components/forum-posts";
import { H2 } from "~/components/header";
import { loadLocale } from "~/lib/locale";

type Props = {
  params: { name: string };
};

export default async function Page({ params: { name: taskName } }: Props) {
  await loadLocale();

  const trainingUser = await getMe();
  if (!trainingUser) return null;

  const user = await getUser(trainingUser.username);
  const task = user.contest.tasks.find((t) => t.name === taskName);
  if (!task) notFound();

  return (
    <div>
      <H2 className="mb-2">
        <Trans>Discussioni del forum</Trans>
      </H2>
      <ForumPosts taskName={task.name} taskTitle={task.title} taskUrl={`/task/terry/${taskName}`} />
    </div>
  );
}
