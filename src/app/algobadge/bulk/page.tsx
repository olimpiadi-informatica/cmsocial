"use client";

import { type CSSProperties, useEffect, useState } from "react";

import { useLingui } from "@lingui/react/macro";
import { uniq } from "lodash-es";

import { algobadge } from "~/lib/algobadge";

import { useBadges } from "./fetcher";
import { Summary } from "./summary";
import { UsersTable } from "./table";

export default function Page() {
  const { t } = useLingui();

  const [usernames, setUsernames] = useState<string>();
  const parsedUsernames = uniq(usernames?.split(/\s+/).filter(Boolean) ?? []);
  const users = useBadges(parsedUsernames);

  useEffect(() => {
    if (usernames === undefined) {
      setUsernames(localStorage.getItem("algobadge-bulk") ?? "");
    } else {
      localStorage.setItem("algobadge-bulk", usernames);
    }
  }, [usernames]);

  return (
    <div className="*:mb-4" style={{ "--cols": Object.keys(algobadge).length } as CSSProperties}>
      <div className="m-4">
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder={t`Inserisci gli username`}
          rows={8}
          value={usernames ?? ""}
          onChange={(e) => setUsernames(e.target.value)}
          // biome-ignore lint/a11y/noAutofocus: this is mostly an internal page, so a11y is not a priority
          autoFocus
        />
      </div>
      <div className="m-4">
        <Summary users={users} />
      </div>
      <UsersTable users={users} />
    </div>
  );
}
