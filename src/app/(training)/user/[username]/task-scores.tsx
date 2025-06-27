import { useLingui } from "@lingui/react/macro";

import { TaskBadge } from "~/components/task-badge";
import { getUserScores, type User } from "~/lib/api/user";

export async function TaskScores({ user }: { user: User }) {
  const { t } = useLingui();

  const scores = await getUserScores(user.id, user.username);

  return (
    <div className="sm:columns-2 md:columns-3 lg:columns-4">
      {scores.map((task) => (
        <TaskBadge key={`${task.terry}-${task.name}`} {...task} />
      ))}
      {scores.length === 0 && t`Nessun problema risolto`}
    </div>
  );
}
