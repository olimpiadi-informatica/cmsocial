import { Trans } from "@lingui/react/macro";
import { Menu } from "@olinfo/react-components";

import { H1 } from "~/components/header";
import { Link } from "~/components/link";
import { getTechniqueTags } from "~/lib/api/tags";
import { loadLocale } from "~/lib/locale";

export default async function Page() {
  await loadLocale();

  const tags = await getTechniqueTags();

  return (
    <>
      <H1 className="mb-2">
        <Trans>Problemi per tecnica</Trans>
      </H1>
      <Menu>
        {tags.map((tag) => (
          <li key={tag.name}>
            <Link href={`/tasks/1?tag=${tag.name}`}>{tag.description}</Link>
          </li>
        ))}
      </Menu>
    </>
  );
}
