import Link from "next/link";

import { Trans } from "@lingui/macro";

import { H2 } from "~/components/header";
import { loadLocale } from "~/lib/locale";

export default async function Page() {
  await loadLocale();

  return (
    <>
      <H2>
        <Trans>Cambia foto profilo</Trans>
      </H2>
      <div className="flex justify-center">
        <Link href="https://gravatar.com/" className="btn btn-primary">
          <Trans>Modifica su Gravatar</Trans>
        </Link>
      </div>
    </>
  );
}
