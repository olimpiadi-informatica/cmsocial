import { useEffect, useId, useSyncExternalStore } from "react";

import { getScores as getTerryScores } from "@olinfo/terry-api";
import { getUser } from "@olinfo/training-api";
import { compact } from "lodash-es";

import { getUserBadges } from "~/lib/algobadge";

import { BadgeExtra, type UserBadge } from "./common";

const pending: string[] = [];
let fetching = 0;
const userBadges = new Map<string, UserBadge>();
const listeners = new Map<string, () => void>();
let version = 0;

function fetchNext() {
  if (fetching < navigator.hardwareConcurrency) {
    const username = pending.shift();
    if (!username) return;

    fetching++;
    Promise.all([getUser(username), getTerryScores(username)]).then(([user, terry]) => {
      const { badges, totalBadge } = getUserBadges(user, terry, true);
      updateUser(username, {
        username,
        user,
        badges,
        totalBadge: user ? totalBadge : BadgeExtra.Invalid,
      });

      fetching--;
      fetchNext();
    });
  }
}

function updateUser(username: string, badges: UserBadge) {
  userBadges.set(username, badges);

  version++;
  if (fetching === navigator.hardwareConcurrency && version % 32 !== 0) return;

  for (const onChange of listeners.values()) {
    onChange();
  }
}

export function useBadges(usernames: string[]) {
  const id = useId();

  useEffect(() => {
    for (const username of usernames) {
      if (userBadges.has(username)) continue;

      const { badges } = getUserBadges(undefined, undefined, true);
      updateUser(username, {
        username,
        user: undefined,
        badges,
        totalBadge: BadgeExtra.Loading,
      });
      pending.push(username);
      fetchNext();
    }
  }, [usernames]);

  useSyncExternalStore(
    (onChange) => {
      listeners.set(id, onChange);
      return () => listeners.delete(id);
    },
    () => version,
    () => version,
  );
  return compact(Array.from(new Set(usernames), (username) => userBadges.get(username)));
}
