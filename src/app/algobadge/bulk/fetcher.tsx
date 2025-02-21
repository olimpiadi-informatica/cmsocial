import { type Dispatch, type SetStateAction, useEffect, useMemo } from "react";

import { getScores as getTerryScores } from "@olinfo/terry-api";
import { getUser } from "@olinfo/training-api";
import useSWR from "swr";

import { getUserBadges } from "~/lib/algobadge";

import { BadgeExtra, type UserBadge, type UserBadges } from "./common";

export function UsersFetcher({
  usernames,
  setUsers,
}: {
  usernames: string[];
  setUsers: Dispatch<SetStateAction<UserBadges>>;
}) {
  return usernames.map((username) => (
    <UserFetcher key={username} username={username} setUsers={setUsers} />
  ));
}

function UserFetcher({
  username,
  setUsers,
}: {
  username: string;
  setUsers: Dispatch<SetStateAction<UserBadges>>;
}) {
  const { data, isLoading } = useSWR(
    ["algobadge", username],
    ([, username]) => Promise.all([getUser(username), getTerryScores(username)]),
    { revalidateIfStale: false, revalidateOnFocus: false },
  );

  const user = data?.[0];
  const terry = data?.[1];

  const { badges, totalBadge } = useMemo(() => getUserBadges(user, terry, true), [user, terry]);

  useEffect(() => {
    setUsers((prev) => ({
      ...prev,
      [username]: {
        username,
        user,
        badges,
        totalBadge: isLoading ? BadgeExtra.Loading : user ? totalBadge : BadgeExtra.Invalid,
      } satisfies UserBadge,
    }));
    return () => setUsers(({ [username]: _user, ...users }) => users);
  }, [badges, totalBadge, isLoading, user, setUsers, username]);

  return null;
}
