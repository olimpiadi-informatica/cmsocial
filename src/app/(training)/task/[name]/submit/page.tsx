import Link from "next/link";
import { notFound } from "next/navigation";

import { Trans } from "@lingui/macro";
import { getMe, getTask } from "@olinfo/training-api";

import { H2 } from "~/components/header";
import { loadLocale } from "~/lib/locale";

import { SubmitBatch } from "./batch";
import { SubmitOutputOnly } from "./output-only";

type Props = {
  params: { name: string };
};

export default async function Page({ params: { name } }: Props) {
  const [_, user, task] = await Promise.all([loadLocale(), getMe(), getTask(name)]);

  if (!task) notFound();
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
          href={`/login?redirect=${encodeURIComponent(`/task/${name}/submit`)}`}
          className="btn btn-primary">
          <Trans>Accedi</Trans>
        </Link>
      </div>
    );
  }

  return task.task_type === "OutputOnly" ? (
    <SubmitOutputOnly task={task} />
  ) : (
    <SubmitBatch task={task} />
  );
}
