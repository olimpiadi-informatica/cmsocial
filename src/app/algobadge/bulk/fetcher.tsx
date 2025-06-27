import { useEffect, useId, useSyncExternalStore } from "react";

import { compact } from "lodash-es";

import { type AlgobadgeScores, getUserBadges } from "~/lib/algobadge";

import { getAlgobadgeScores } from "./actions";
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
    getAlgobadgeScores(username).then(
      (scores?: AlgobadgeScores) => {
        const { badges, totalBadge } = getUserBadges(scores, true);
        updateUser(username, {
          username,
          name: scores?.name,
          badges,
          totalBadge: scores ? totalBadge : BadgeExtra.Invalid,
        });

        fetching--;
        fetchNext();
      },
      () => {
        fetching--;
      },
    );
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

      const { badges } = getUserBadges(undefined, true);
      updateUser(username, {
        username,
        name: undefined,
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
