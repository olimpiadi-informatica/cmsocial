import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";

import { SiGithub, SiTelegram, SiYoutube } from "@icons-pack/react-simple-icons";
import oii from "~/app/icon0.svg";

export function Footer() {
  const { _ } = useLingui();

  return (
    <div className="bg-base-200 text-base-content">
      <footer className="footer mx-auto max-w-screen-xl p-10">
        <aside>
          <img
            src={oii.src}
            width={oii.width}
            height={oii.height}
            alt={_(msg`Logo Olimpiadi Italiane di Informatica`)}
            className="h-20 w-auto"
          />
          <p>Olimpiadi di Informatica &copy; {new Date().getFullYear()}</p>
          <div className="mt-1 flex gap-2">
            <a href="https://github.com/olimpiadi-informatica" target="_blank" rel="noreferrer">
              <SiGithub size={20} />
            </a>
            <a href="https://t.me/+Zp70NXu5W04xMjQ0" target="_blank" rel="noreferrer">
              <SiTelegram size={20} />
            </a>
            <a
              href="https://www.youtube.com/@olimpiadiitalianediinforma4928"
              target="_blank"
              rel="noreferrer">
              <SiYoutube size={20} />
            </a>
          </div>
        </aside>
        <nav>
          <h3 className="footer-title">
            <Trans>Siti ufficiali</Trans>
          </h3>
          <a
            href="https://olimpiadi-informatica.it"
            className="link-hover link"
            target="_blank"
            rel="noreferrer">
            <Trans>Olimpiadi Italiane di Informatica</Trans>
          </a>
          <a
            href="https://sites.google.com/aldini.istruzioneer.it/olimpiadi-informatica-squadre/homepage"
            className="link-hover link"
            target="_blank"
            rel="noreferrer">
            <Trans>Olimpiadi di Informatica a Squadre</Trans>
          </a>
          <a
            href="https://fibonacci.olinfo.it"
            className="link-hover link"
            target="_blank"
            rel="noreferrer">
            <Trans>Giochi di Fibonacci</Trans>
          </a>
          <a
            href="https://miur.gov.it/"
            className="link-hover link"
            target="_blank"
            rel="noreferrer">
            <Trans>Ministero dell'Istruzione e del Merito</Trans>
          </a>
          <a
            href="https://www.aicanet.it/"
            className="link-hover link"
            target="_blank"
            rel="noreferrer">
            AICA
          </a>
        </nav>
        <nav>
          <h3 className="footer-title">
            <Trans>Altre Risorse</Trans>
          </h3>
          <a
            href="https://forum.olinfo.it/new-topic?category=Meta"
            className="link-hover link"
            target="_blank"
            rel="noreferrer">
            <Trans>Segnalazioni bug</Trans>
          </a>
          <a
            href="https://stats.olinfo.it"
            className="link-hover link"
            target="_blank"
            rel="noreferrer">
            <Trans>Classifiche OII</Trans>
          </a>
          <a
            href="https://squadre.olinfo.it"
            className="link-hover link"
            target="_blank"
            rel="noreferrer">
            <Trans>Classifiche OIS</Trans>
          </a>
          <a
            href="https://status.olinfo.it"
            className="link-hover link"
            target="_blank"
            rel="noreferrer">
            <Trans>Stato server</Trans>
          </a>
          <a
            href="https://wiki.olinfo.it"
            className="link-hover link"
            target="_blank"
            rel="noreferrer">
            <Trans>Wiki</Trans>
          </a>
        </nav>
      </footer>
    </div>
  );
}
