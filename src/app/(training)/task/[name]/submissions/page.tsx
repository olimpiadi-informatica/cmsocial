import Link from "next/link";

import { Trans } from "@lingui/macro";

import { H2 } from "~/components/header";
import { getTaskSubmissions } from "~/lib/api/submissions";
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

  const submissions = await getTaskSubmissions(taskName, user.id);
  return <PageClient taskName={taskName} submissions={submissions} />;
}
