import type { User } from "~/lib/api/user";
import { getScoreProgress } from "~/lib/api/user-stats";
import type { User as AuthUser } from "~/lib/auth/types";

import { ProgressChart } from "./progress-chart";

export async function Progress({ user, me }: { user: User; me?: AuthUser }) {
  const isDifferentUser = me && me.username !== user.username;
  const [userData, meData] = await Promise.all([
    getScoreProgress(user.cmsId, user.registrationTime),
    isDifferentUser ? getScoreProgress(me.cmsId) : undefined,
  ]);

  return (
    <ProgressChart
      username={user.username}
      meUsername={isDifferentUser ? me.username : undefined}
      userData={userData}
      meData={meData}
    />
  );
}
