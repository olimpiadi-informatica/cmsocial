import { Trans, useLingui } from "@lingui/react/macro";
import { Menu } from "@olinfo/react-components";

import { H2 } from "~/components/header";
import { getTaskAttachments } from "~/lib/api/task";
import { loadLocale } from "~/lib/locale";

type Props = {
  params: Promise<{ name: string }>;
};

export default async function Page({ params }: Props) {
  const { name } = await params;

  await loadLocale();
  const { t } = useLingui();

  const attachments = await getTaskAttachments(name);

  return (
    <div>
      <H2 className="mb-2">
        <Trans>Allegati</Trans>
      </H2>
      <Menu fallback={t`Nessun allegato`}>
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
