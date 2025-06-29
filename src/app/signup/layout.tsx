import type { ReactNode } from "react";

import { Trans, useLingui } from "@lingui/react/macro";
import { Card, CardBody } from "@olinfo/react-components";

import oii from "~/app/icon0.svg";
import { loadLocale } from "~/lib/locale";

export default async function Layout({ children }: { children: ReactNode }) {
  await loadLocale();
  const { t } = useLingui();

  return (
    <div className="flex grow justify-center w-full flex-col mx-auto max-w-screen-xl p-4 pb-8">
      <img
        src={oii.src}
        width={oii.width}
        height={oii.height}
        alt={t`Logo Olimpiadi Italiane di Informatica`}
        className="h-20 w-auto m-8"
      />
      <div className="flex justify-center">
        <Card className="*:gap-8">
          <CardBody
            title={
              <span className="text-center block w-full">
                <Trans>Crea un account</Trans>
              </span>
            }>
            {children}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
