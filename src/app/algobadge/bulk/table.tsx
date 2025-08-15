import { Trans } from "@lingui/react/macro";
import { Medal } from "lucide-react";

import { Link } from "~/components/link";
import { Table } from "~/components/table";
import { algobadge, Badge, badgeStroke } from "~/lib/algobadge";

import { BadgeExtra, type UserBadge } from "./common";

export function UsersTable({ users }: { users: UserBadge[] }) {
  return (
    <Table
      data={users}
      header={TableHeaders}
      row={TableRow}
      className="grid-cols-[1fr_5rem_repeat(var(--cols),3rem)]"
    />
  );
}

function TableHeaders() {
  return (
    <>
      <div>
        <Trans>Username</Trans>
      </div>
      <div>
        <Trans>Totale</Trans>
      </div>
      {Object.keys(algobadge).map((id) => (
        <div key={id}>{id}</div>
      ))}
    </>
  );
}

function TableRow({ item: user }: { item: UserBadge }) {
  return (
    <>
      <div className="min-w-64 text-wrap text-left">
        <Link
          href={
            user.username
              ? `/algobadge?impersonate=${encodeURIComponent(user.username)}&unlock=1`
              : ""
          }
          className="link text-blue-600 dark:text-blue-400">
          {user.username}
        </Link>
        {user.totalBadge === BadgeExtra.Invalid && (
          <span className="text-sm text-error">
            {" "}
            <Trans>(username non valido)</Trans>
          </span>
        )}
        {user.name && <span className="text-sm text-base-content/80"> ({user.name})</span>}
      </div>
      <div className="mx-auto">
        {user.totalBadge <= Badge.Diamond && (
          <Medal className={badgeStroke[user.totalBadge as Badge]} />
        )}
      </div>
      {Object.entries(user.badges ?? {}).map(([id, badge]) => (
        <Link
          key={id}
          href={
            user
              ? `/algobadge?category=${id}&impersonate=${encodeURIComponent(user.username)}&unlock=1`
              : ""
          }
          className="mx-auto">
          {user.totalBadge === BadgeExtra.Loading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <Medal className={badgeStroke[badge.badge ?? Badge.None]} />
          )}
        </Link>
      ))}
    </>
  );
}
