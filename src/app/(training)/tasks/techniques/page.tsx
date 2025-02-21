import Link from "next/link";

import { Trans } from "@lingui/macro";
import { Menu } from "@olinfo/react-components";

import { H1 } from "~/components/header";
import { loadLocale } from "~/lib/locale";

export default async function Page() {
  await loadLocale();

  return (
    <>
      <H1 className="mb-2">
        <Trans>Problemi per tecnica</Trans>
      </H1>
      <Menu>
        <li>
          <Link href="/tasks/1?tag=ad_hoc">
            <Trans>Ad hoc</Trans>
          </Link>
        </li>
        <li>
          <Link href="/tasks/1?tag=divide_and_conquer">
            <Trans>Divide & Conquer</Trans>
          </Link>
        </li>
        <li>
          <Link href="/tasks/1?tag=geometry">
            <Trans>Geometria</Trans>
          </Link>
        </li>
        <li>
          <Link href="/tasks/1?tag=graphs">
            <Trans>Grafi</Trans>
          </Link>
        </li>
        <li>
          <Link href="/tasks/1?tag=greedy">
            <Trans>Greedy</Trans>
          </Link>
        </li>
        <li>
          <Link href="/tasks/1?tag=implementation">
            <Trans>Implementazione</Trans>
          </Link>
        </li>
        <li>
          <Link href="/tasks/1?tag=math">
            <Trans>Matematica</Trans>
          </Link>
        </li>
        <li>
          <Link href="/tasks/1?tag=extreme_optimization">
            <Trans>Ottimizzazioni estreme</Trans>
          </Link>
        </li>
        <li>
          <Link href="/tasks/1?tag=dp">
            <Trans>Programmazione dinamica</Trans>
          </Link>
        </li>
        <li>
          <Link href="/tasks/1?tag=binary_search">
            <Trans>Ricerca binaria</Trans>
          </Link>
        </li>
        <li>
          <Link href="/tasks/1?tag=strings">
            <Trans>Stringhe</Trans>
          </Link>
        </li>
        <li>
          <Link href="/tasks/1?tag=data_structures">
            <Trans>Strutture dati</Trans>
          </Link>
        </li>
      </Menu>
    </>
  );
}
