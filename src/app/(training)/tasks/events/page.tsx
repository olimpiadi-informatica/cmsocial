import Link from "next/link";

import { Trans } from "@lingui/macro";
import { Menu } from "@olinfo/react-components";

import { H1, H2 } from "~/components/header";
import { loadLocale } from "~/lib/locale";

export default async function Page() {
  await loadLocale();

  return (
    <>
      <H1>
        <Trans>Problemi per gara</Trans>
      </H1>
      <H2 className="mb-2 mt-6">
        <Trans>Gare ufficiali</Trans>
      </H2>
      <Menu>
        <li>
          <Link href="/scolastiche">Scolastiche</Link>
        </li>
        <li>
          <Link href="/tasks/1?tag=territoriali">
            <Trans>
              Territoriali <span className="text-base-content/60">(vecchio formato)</span>
            </Trans>
          </Link>
        </li>
        <li>
          <Link href="/tasks/terry/1">
            <Trans>
              Territoriali <span className="text-base-content/60">(nuovo formato)</span>
            </Trans>
          </Link>
        </li>
        <li>
          <Link href="/tasks/1?tag=pre-oii">Pre-OII</Link>
        </li>
        <li>
          <Link href="/tasks/1?tag=nazionali">Nazionali</Link>
        </li>
        <li>
          <Link href="/tasks/1?tag=ois">
            <Trans>
              Gare a squadre <span className="text-base-content/60">(OIS)</span>
            </Trans>
          </Link>
        </li>
        <li>
          <Link href="/tasks/1?tag=ioi">
            International Olympiad in Informatics
            <span className="text-base-content/60">(IOI)</span>
          </Link>
        </li>
        <li>
          <Link href="/tasks/1?tag=ioit">
            International Informatics Olympiad in Teams
            <span className="text-base-content/60">(IIOT)</span>
          </Link>
        </li>
      </Menu>
      <H2 className="mb-2 mt-6">
        <Trans>Altre gare</Trans>
      </H2>
      <Menu>
        <li>
          <Link href="/fibonacci">
            <Trans>Giochi di Fibonacci</Trans>
          </Link>
        </li>
        <li>
          <Link href="/tasks/1?tag=abc">
            Algoritmi Bergamo Contest <span className="text-base-content/60">(ABC)</span>
          </Link>
        </li>
        <li>
          <Link href="/tasks/1?tag=coci">
            Croatian Open Competition in Informatics
            <span className="text-base-content/60">(COCI)</span>
          </Link>
        </li>
        <li>
          <Link href="/tasks/1?tag=roiti">
            <Trans>Gara di allenamento Istituto Roiti Ferrara</Trans>
          </Link>
        </li>
        <li>
          <Link href="/tasks/1?tag=gator">
            <Trans>
              Gara di Allenamento Tor Vergata <span className="text-base-content/60">(GATOR)</span>
            </Trans>
          </Link>
        </li>
        <li>
          <Link href="/tasks/1?tag=unimiopc">
            <Trans>Selezione SWERC dell&apos;Università degli Studi di Milano</Trans>
          </Link>
        </li>
      </Menu>
    </>
  );
}
