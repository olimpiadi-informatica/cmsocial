import { notFound } from "next/navigation";

import { Trans, useLingui } from "@lingui/react/macro";
import { Menu } from "@olinfo/react-components";

import { H2 } from "~/components/header";
import { Link } from "~/components/link";
import { getTaskStats } from "~/lib/api/task";
import { loadLocale } from "~/lib/locale";

type Props = {
  params: Promise<{ name: string }>;
};

export default async function Page({ params }: Props) {
  const { name: taskName } = await params;

  await loadLocale();
  const { t } = useLingui();

  const stats = await getTaskStats(taskName);
  if (!stats) notFound();

  return (
    <div>
      <H2 className="mb-2">
        <Trans>Statistiche generali</Trans>
      </H2>
      <ul className="w-full rounded-box bg-base-200 p-2 *:p-2">
        <li>
          <span className="font-bold">
            <Trans>Utenti che l&apos;hanno provato:</Trans>
          </span>{" "}
          {stats.userCount}
        </li>
        <li>
          <span className="font-bold">
            <Trans>Utenti che l&apos;hanno risolto:</Trans>
          </span>{" "}
          {stats.correctUserCount}{" "}
          {stats.userCount > 0 && (
            <span className="text-sm text-base-content/80">
              ({Math.round((stats.correctUserCount / stats.userCount) * 100)}%)
            </span>
          )}
        </li>
        <li>
          <span className="font-bold">
            <Trans>Soluzioni inviate:</Trans>
          </span>{" "}
          {stats.subCount}
        </li>
        <li>
          <span className="font-bold">
            <Trans>Soluzioni corrette:</Trans>
          </span>{" "}
          {stats.correctSubCount}{" "}
          {stats.subCount > 0 && (
            <span className="text-sm text-base-content/80">
              ({Math.round((stats.correctSubCount / stats.subCount) * 100)}%)
            </span>
          )}
        </li>
      </ul>
      <H2 className="mb-2 mt-8">
        <Trans>Soluzione più veloci</Trans>
      </H2>
      <Menu fallback={t`Nessuna soluzione`}>
        {stats.topUsers.map((user, i) => (
          <li key={user.username}>
            <Link href={`/user/${user.username}`} className="flex justify-between">
              <div>
                <span className="inline-block w-8">{i + 1}</span> {user.username}
              </div>
              <div className="font-mono">{user.time?.toFixed(3)}</div>
            </Link>
          </li>
        ))}
      </Menu>
    </div>
  );
}
