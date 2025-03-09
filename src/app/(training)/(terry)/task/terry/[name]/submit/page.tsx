import Link from "next/link";
import { notFound } from "next/navigation";

import { Trans } from "@lingui/macro";

import { H2 } from "~/components/header";
import { getTerryTask, getTerryTaskInput } from "~/lib/api/task-terry";
import { loadLocale } from "~/lib/locale";
import { getSessionUser } from "~/lib/user";

import { PageClient } from "./page-client";

type Props = {
  params: { name: string };
};

export default async function Page({ params: { name: taskName } }: Props) {
  await loadLocale();

  const user = getSessionUser();
  if (!user) {
    return (
      <div className="text-center">
        <H2>
          <Trans>Invia soluzione</Trans>
        </H2>
        <div className="my-2">
          <Trans>Accedi per inviare soluzioni</Trans>
        </div>
        <Link
          href={`/login?redirect=${encodeURIComponent(`/task/terry/${taskName}/submit`)}`}
          className="btn btn-primary">
          <Trans>Accedi</Trans>
        </Link>
      </div>
    );
  }

  const [task, input] = await Promise.all([
    getTerryTask(taskName),
    getTerryTaskInput(taskName, user.username),
  ]);
  if (!task) notFound();

  return <PageClient task={task} input={input} />;
}
