import Link from "next/link";
import type { ComponentType, ReactNode } from "react";

import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Card, CardActions, CardBody } from "@olinfo/react-components";
import clsx from "clsx";
import { BookText, type LucideIcon, Route, UsersRound } from "lucide-react";

import { loadLocale } from "~/lib/locale";

import { Algobadge } from "./algobadge";
import { Community } from "./community";
import { Footer } from "./footer";
import { Training } from "./training";
import { Wiki } from "./wiki";

export default async function Home() {
  await loadLocale();
  const { _ } = useLingui();

  return (
    <>
      <div className="mx-auto max-w-screen-xl flex grow flex-col gap-8 p-4 pb-8">
        <div className="hero">
          <div className="hero-content flex-col text-center">
            <h1 className="text-pretty text-4xl lg:text-5xl font-extrabold dark:md:text-white dark:md:w-min">
              <Trans>
                <span className="dark:md:whitespace-nowrap">Portale di allenamento delle</span>{" "}
                <span className="dark:md:whitespace-nowrap">
                  <span className="dark:md:text-emerald-500">Olimpiadi</span>{" "}
                  <span>Italiane di</span> <span className="dark:md:text-red-500">Informatica</span>
                </span>
              </Trans>
            </h1>
            <p className="py-2 text-lg max-w-2xl">
              <Trans>
                Benvenuto nella piattaforma ufficiale di allenamento per le OII! Qui avrai accesso a
                numerosi problemi ai quali potrai inviare delle soluzioni scritte in un linguaggio
                di programmazione a tua scelta.
              </Trans>
            </p>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardBody title={_(msg`Risolvi tutti i problemi`)}>
              <p>
                <Trans>
                  La vasta scelta di problemi presenti nel sito ti permetterà di prepararti al
                  meglio per ogni fase delle Olimpiadi, partendo dalla fase scolastica fino ad
                  arrivare alla finale nazionale.
                </Trans>
              </p>
              <CardActions>
                <Link href="/scolastiche" className="btn btn-accent" prefetch>
                  <Trans>Scolastiche</Trans>
                </Link>
                <Link href="/tasks/terry/1" className="btn btn-accent" prefetch>
                  <Trans>Territoriali</Trans>
                </Link>
                <Link href="/tasks/1" className="btn btn-accent" prefetch>
                  <Trans>Nazionali, OIS e altre gare</Trans>
                </Link>
              </CardActions>
            </CardBody>
            <CardImage image={Training} className="min-h-40 min-w-40" />
          </Card>

          <Card>
            <CardBody title={_(msg`Entra nella community`)}>
              <p>
                <Trans>
                  Presentati agli altri aspiranti olimpici nel forum della piattaforma, discuti dei
                  problemi, risolvi tutti i tuoi dubbi su: costrutti di base del tuo linguaggio di
                  programmazione, algoritmi e strutture dati di libreria, tecniche algoritmiche, e
                  tanto altro!
                </Trans>
              </p>
              <CardButton href="https://forum.olinfo.it" icon={UsersRound}>
                <Trans>Forum</Trans>
              </CardButton>
            </CardBody>
            <CardImage image={Community} className="min-h-40 min-w-40" />
          </Card>

          <Card>
            <CardBody title={_(msg`Impara gradualmente`)}>
              <p>
                <Trans>
                  Con Algobadge ti guideremo attraverso una selezione accurata di task da risolvere,
                  ordinati per difficoltà crescente, che ti permetteranno di esplorare nuove
                  tecniche algoritmiche in modo graduale ed efficace.
                </Trans>
              </p>
              <CardButton href="/algobadge" icon={Route}>
                <Trans>Algobadge</Trans>
              </CardButton>
            </CardBody>
            <CardImage image={Algobadge} className="min-h-80 min-w-40" />
          </Card>

          <Card>
            <CardBody title={_(msg`Leggi la wiki`)}>
              <p>
                <Trans>
                  Nella wiki ufficiale troverai spiegazioni dettagliate e soluzioni di problemi
                  passati, oltre che a tutorial approfonditi su tecniche algoritmiche avanzate.
                </Trans>
              </p>
              <CardButton href="https://wiki.olinfo.it" icon={BookText}>
                <Trans>Wiki</Trans>
              </CardButton>
            </CardBody>
            <CardImage image={Wiki} className="min-h-40 min-w-40" />
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}

type ButtonProps = {
  href: string;
  icon: LucideIcon;
  children: ReactNode;
};

function CardButton({ href, icon: Icon, children }: ButtonProps) {
  return (
    <CardActions>
      <Link className="btn btn-accent" href={href}>
        <Icon size={20} />
        {children}
      </Link>
    </CardActions>
  );
}

function CardImage({
  image: Image,
  className,
}: {
  image: ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <div className={clsx("relative max-sm:order-first", className)}>
      <div className="absolute inset-0">
        <Image className="m-auto size-full p-8 max-sm:pb-0 sm:pl-0" />
      </div>
    </div>
  );
}
