import Link from "next/link";
import { notFound } from "next/navigation";

import { Trans } from "@lingui/macro";
import { getMe, getTaskSubmissions } from "@olinfo/training-api";

import { H2 } from "~/components/header";
import { loadLocale } from "~/lib/locale";

import { PageClient } from "./page-client";

type Props = {
  params: { name: string };
};

export default async function Page({ params: { name: taskName } }: Props) {
  await loadLocale();
  const user = await getMe();

  if (!user) {
    return (
      <div>
        <H2 className="mb-2">
          <Trans>Sottoposizioni</Trans>
        </H2>
        <div className="text-center">
          <div className="my-2">
            <Trans>Accedi per vedere le tue sottoposizioni</Trans>
          </div>
          <Link
            href={`/login?redirect=${encodeURIComponent(`/task/${taskName}/submissions`)}`}
            className="btn btn-primary">
            <Trans>Accedi</Trans>
          </Link>
        </div>
      </div>
    );
  }

  const submissions = await getTaskSubmissions(taskName);
  if (!submissions) notFound();

  return <PageClient taskName={taskName} submissions={submissions} />;
}
