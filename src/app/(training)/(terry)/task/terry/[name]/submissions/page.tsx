import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { Menu } from "@olinfo/react-components";

import { DateTime } from "~/components/date";
import { H2 } from "~/components/header";
import { Link } from "~/components/link";
import { OutcomeScore } from "~/components/outcome";
import { getTerrySubmissions } from "~/lib/api/submissions-terry";
import { fileLanguageName } from "~/lib/language";
import { loadLocale } from "~/lib/locale";
import { getSessionUser } from "~/lib/user";

type Props = {
  params: Promise<{ name: string }>;
};

export default async function Page({ params }: Props) {
  const { name: taskName } = await params;

  await loadLocale();
  const { _ } = useLingui();

  const user = await getSessionUser();
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
            href={`/login?redirect=${encodeURIComponent(`/task/terry/${taskName}/submissions`)}`}
            className="btn btn-primary">
            <Trans>Accedi</Trans>
          </Link>
        </div>
      </div>
    );
  }

  const submissions = await getTerrySubmissions(taskName, user.username);

  return (
    <div>
      <H2 className="mb-2">
        <Trans>Sottoposizioni</Trans>
      </H2>
      <div className="w-full overflow-x-auto max-md:w-screen max-md:-translate-x-4 max-md:px-4">
        <Menu className="grid min-w-fit grid-cols-[auto_auto_1fr_auto]">
          <h3 className="menu-title col-span-4 grid grid-cols-subgrid gap-2">
            <div>
              <Trans>ID</Trans>
            </div>
            <div>
              <Trans>Linguaggio</Trans>
            </div>
            <div>
              <Trans>Data e ora</Trans>
            </div>
            <div className="text-end">
              <Trans>Esito</Trans>
            </div>
          </h3>
          {submissions.map((sub) => (
            <li key={sub.id} className="col-span-4 grid grid-cols-subgrid">
              <Link
                href={`/task/terry/${taskName}/submissions/${sub.id}`}
                className="col-span-4 grid grid-cols-subgrid text-nowrap">
                <div className="mr-1">{sub.id.split("-")[0]}</div>
                <div>{fileLanguageName(sub.source, _)}</div>
                <div>
                  <DateTime date={sub.date} />
                </div>
                <div className="min-w-40 text-end">
                  <OutcomeScore score={sub.score} maxScore={sub.maxScore} />
                </div>
              </Link>
            </li>
          ))}
          {submissions.length === 0 && (
            <li className="col-span-full p-2 text-center">
              <Trans>Nessuna sottoposizione inviata</Trans>
            </li>
          )}
        </Menu>
      </div>
    </div>
  );
}
