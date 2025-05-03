import { notFound } from "next/navigation";

import { Trans } from "@lingui/react/macro";

import { H2 } from "~/components/header";
import { Link } from "~/components/link";
import { getTask, getTaskLanguages } from "~/lib/api/task";
import { loadLocale } from "~/lib/locale";
import { getSessionUser } from "~/lib/user";

import { SubmitBatch } from "./batch";
import { SubmitOutputOnly } from "./output-only";

type Props = {
  params: Promise<{ name: string }>;
};

export default async function Page({ params }: Props) {
  const { name } = await params;

  const [_, user, task, languages] = await Promise.all([
    loadLocale(),
    getSessionUser(),
    getTask(name),
    getTaskLanguages(name),
  ]);

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

  return task.io === "output-only" ? (
    <SubmitOutputOnly task={task} />
  ) : (
    <SubmitBatch task={task} languages={languages} />
  );
}
