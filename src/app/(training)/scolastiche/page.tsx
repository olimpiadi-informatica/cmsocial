import { Trans } from "@lingui/macro";
import { Menu } from "@olinfo/react-components";
import { kebabCase } from "lodash-es";

import type { Metadata } from "next";
import { H1 } from "~/components/header";
import { loadLocale } from "~/lib/locale";

export const metadata: Metadata = {
  title: "Training - Scolastiche",
  description:
    "Lista delle prove delle selezioni scolastiche delle Olimpiadi Italiane di Informatica",
};

const editions = ["2024", "2023", "2022", "2022 - Demo", "2021", "2020", "2019"];

export default async function Page() {
  await loadLocale();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <H1 className="px-2">
          <Trans>Selezioni scolastiche</Trans>
        </H1>
      </div>
      <Menu>
        {editions.map((edition) => (
          <li key={edition}>
            <a
              href={`https://scolastiche.olinfo.it/scolastiche/${kebabCase(edition)}/`}
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
