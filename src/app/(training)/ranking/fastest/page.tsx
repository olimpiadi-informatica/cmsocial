import type { Metadata } from "next";

import { Trans, useLingui } from "@lingui/react/macro";
import { Avatar, Menu } from "@olinfo/react-components";

import { H1 } from "~/components/header";
import { Link } from "~/components/link";
import { type BestTimeTask, getBestTimesRanking } from "~/lib/api/best-times";
import { loadLocale } from "~/lib/locale";

export const metadata: Metadata = {
  title: "Training - Ranking soluzioni più veloci",
  description:
    "Classifica delle soluzioni più veloci della piattaforma di allenamento delle Olimpiadi Italiane di Informatica",
};

export default async function Page() {
  const [, { users, tiedTasks }] = await Promise.all([loadLocale(), getBestTimesRanking()]);

  const { t } = useLingui();

  let rank = 0;

  return (
    <div className="flex flex-col gap-4">
      <H1 className="px-2">
        <Trans>Soluzioni più veloci</Trans>
      </H1>
      <p className="px-2 text-base-content/80">
        <Trans>
          Per ogni utente, il numero di problemi in cui detiene da solo il tempo di esecuzione
          migliore tra tutte le soluzioni da 100 punti.
        </Trans>
      </p>
      <Menu fallback={t`Nessun utente trovato`}>
        {users.map((user, i) => {
          if (i === 0 || users[i - 1].tasks.length !== user.tasks.length) rank = i + 1;
          return (
            <li key={user.id}>
              <details>
                <summary className="flex justify-between">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="min-w-8">{rank}</div>
                    <Avatar size={32} username={user.username} url={user.image} />
                    <Link href={`/user/${user.username}`} className="link link-hover">
                      {user.username}
                    </Link>
                    <div className="text-base-content/60 max-sm:hidden">({user.name})</div>
                  </div>
                  <div className="ml-auto font-mono">{user.tasks.length}</div>
                </summary>
                <TaskList tasks={user.tasks} />
              </details>
            </li>
          );
        })}
        {tiedTasks.length > 0 && (
          <li>
            <details>
              <summary className="flex justify-between">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="min-w-8" />
                  <div className="italic">
                    <Trans>Problemi con tempo migliore a pari merito</Trans>
                  </div>
                </div>
                <div className="ml-auto font-mono">{tiedTasks.length}</div>
              </summary>
              <TaskList tasks={tiedTasks} showTies />
            </details>
          </li>
        )}
      </Menu>
    </div>
  );
}

function TaskList({ tasks, showTies }: { tasks: BestTimeTask[]; showTies?: boolean }) {
  return (
    <ul>
      {tasks.map(({ tiedCount, ...task }) => (
        <li key={task.name}>
          <Link href={`/task/${task.name}/stats`} className="flex justify-between">
            <div>
              {task.title} <span className="text-base-content/60">({task.name})</span>
            </div>
            <div className="font-mono text-nowrap">
              {showTies && (
                <span className="text-base-content/60 mr-2">
                  <Trans>{tiedCount} utenti</Trans>
                </span>
              )}
              {task.time.toFixed(3)}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
