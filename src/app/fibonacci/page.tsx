import Link from "next/link";

import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Card, CardActions, CardBody } from "@olinfo/react-components";

import { loadLocale } from "~/lib/locale";

export default async function Page() {
  await loadLocale();
  const { _ } = useLingui();

  return (
    <div className="flex grow flex-col gap-8">
      <div className="hero">
        <div className="hero-content max-w-2xl flex-col text-center">
          <h1 className="text-pretty text-4xl font-bold">
            <Trans>Portale di allenamento dei Giochi di Fibonacci</Trans>
          </h1>
          <p className="py-2">
            <Trans>
              Benvenuto nella piattaforma ufficiale di allenamento dei Giochi di Fibonacci!
            </Trans>
          </p>
        </div>
      </div>
      <div className="*:mb-4 lg:columns-2">
        <Card>
          <CardBody title={_(msg`Iscriviti`)}>
            <p>
              <Trans>
                Nel sito ufficiale potrai trovare il regolamento, il calendario e le modalità di
                iscrizione.
              </Trans>
            </p>
            <CardActions>
              <a
                href="https://fibonacci.olinfo.it"
                className="btn btn-accent"
                target="_blank"
                rel="noreferrer">
                <Trans>Sito ufficiale</Trans>
              </a>
            </CardActions>
          </CardBody>
        </Card>
        <Card>
          <CardBody title={_(msg`Inizia ad allenarti`)}>
            <p>
              <Trans>
                Allenati per i Giochi di Fibonacci risolvendo gli esercizi degli anni passati.
              </Trans>
            </p>
            <CardActions>
              <Link href="/fibonacci/primarie" className="btn btn-accent">
                <Trans>Scuole Primarie</Trans>
              </Link>
              <Link href="/fibonacci/secondarie" className="btn btn-accent">
                <Trans>Scuole Secondarie</Trans>
              </Link>
            </CardActions>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
