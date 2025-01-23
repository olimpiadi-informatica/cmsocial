import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Menu } from "@olinfo/react-components";

import { H2 } from "~/components/header";
import { getTaskAttachments } from "~/lib/api/task";
import { loadLocale } from "~/lib/locale";

type Props = {
  params: { name: string };
};

export default async function Page({ params: { name } }: Props) {
  await loadLocale();
  const { _ } = useLingui();

  const attachments = await getTaskAttachments(name);

  return (
    <div>
      <H2 className="mb-2">
        <Trans>Allegati</Trans>
      </H2>
      <Menu fallback={_(msg`Nessun allegato`)}>
        {attachments.map((att) => (
          <li key={att.name}>
            <a href={att.url} download>
              {att.name}
            </a>
          </li>
        ))}
      </Menu>
    </div>
  );
}
