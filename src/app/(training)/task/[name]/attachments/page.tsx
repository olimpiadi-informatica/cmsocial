import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Menu } from "@olinfo/react-components";
import { fileUrl, getTask } from "@olinfo/training-api";
import { sortBy } from "lodash-es";

import { notFound } from "next/navigation";
import { H2 } from "~/components/header";
import { loadLocale } from "~/lib/locale";

type Props = {
  params: { name: string };
};

export default async function Page({ params: { name } }: Props) {
  await loadLocale();
  const { _ } = useLingui();

  const task = await getTask(name);
  if (!task) notFound();
  const attachments = sortBy(task.attachments, "name");

  return (
    <div>
      <H2 className="mb-2">
        <Trans>Allegati</Trans>
      </H2>
      <Menu fallback={_(msg`Nessun allegato`)}>
        {attachments.map((att) => (
          <li key={att.name}>
            <a href={fileUrl(att)} download>
              {att.name}
            </a>
          </li>
        ))}
      </Menu>
    </div>
  );
}
