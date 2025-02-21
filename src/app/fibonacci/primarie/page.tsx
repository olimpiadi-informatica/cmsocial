import { Trans } from "@lingui/macro";
import { Menu } from "@olinfo/react-components";
import { kebabCase } from "lodash-es";

import { H1 } from "~/components/header";
import { loadLocale } from "~/lib/locale";

const editions = [
  "2024 - Prima fase",
  "2023 - Seconda fase",
  "2023 - Seconda fase - Demo",
  "2023 - Prima fase",
  "2022 - Prima fase",
];

export default async function Page() {
  await loadLocale();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <H1 className="px-2">
          <Trans>Giochi di Fibonacci - Scuole primarie</Trans>
        </H1>
      </div>
      <Menu>
        {editions.map((edition) => (
          <li key={edition}>
            <a
              href={`https://scolastiche.olinfo.it/fibonacci-primarie/${kebabCase(edition)}/`}
              target="_blank"
              rel="noreferrer">
              <Trans>Edizione {edition}</Trans>
            </a>
          </li>
        ))}
      </Menu>
    </div>
  );
}
