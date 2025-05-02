import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Trans, useLingui } from "@lingui/react/macro";
import { Avatar, Menu } from "@olinfo/react-components";

import { H1 } from "~/components/header";
import { Pagination } from "~/components/pagination";
import { getRanking, getUserCount } from "~/lib/api/users";
import { loadLocale } from "~/lib/locale";

export const metadata: Metadata = {
  title: "Training - Ranking",
  description:
    "Classifica della piattaforma di allenamento delle Olimpiadi Italiane di Informatica",
};

type Props = {
  params: Promise<{ page: string }>;
};

export default async function Page({ params }: Props) {
  const { page: pageStr } = await params;

  const page = Number(pageStr);
  const pageSize = 20;

  if (!Number.isInteger(page) || page < 1) notFound();

  const [, users, count] = await Promise.all([
    loadLocale(),
    getRanking(page, pageSize),
    getUserCount(),
  ]);

  const pageCount = Math.max(Math.ceil(count / pageSize), 1);
  if (page > pageCount) notFound();

  const { t } = useLingui();

  return (
    <div className="flex flex-col gap-4">
      <H1 className="px-2">
        <Trans>Pagina {page}</Trans>
      </H1>
      <Menu fallback={t`Nessun utente trovato`}>
        {users.map((user, i) => (
          <li key={user.id}>
            <Link href={`/user/${user.username}`} className="flex justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="min-w-8">{i + (page - 1) * pageSize + 1}</div>
                <Avatar size={32} username={user.username} url={user.image} />
                <div>{user.username}</div>
                <div className="text-base-content/60 max-sm:hidden">({user.name})</div>
              </div>
              <div className="font-mono">{user.score}</div>
            </Link>
          </li>
        ))}
      </Menu>
      <Pagination page={page} pageCount={pageCount} />
    </div>
  );
}
