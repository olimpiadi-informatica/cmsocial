"use client";

import { useParams, useRouter, useSelectedLayoutSegment } from "next/navigation";
import { type MouseEvent, type ReactNode, useRef } from "react";

import { Trans, useLingui } from "@lingui/react/macro";
import { Button, Modal, Tabs } from "@olinfo/react-components";
import clsx from "clsx";

import { Link } from "~/components/link";
import type { EditorialAccess } from "~/lib/editorials";

type Props = {
  editorialAccess: EditorialAccess;
};

export function TaskTabs({ editorialAccess }: Props) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const selectedPage = useSelectedLayoutSegment() ?? "";
  const { name: taskName } = useParams();
  const { t } = useLingui();

  const handleEditorialTabClick = (e: MouseEvent) => {
    e.preventDefault();
    modalRef.current?.showModal();
  };

  const handleConfirm = () => {
    modalRef.current?.close();
    if (!editorialAccess.hasEditorial || !editorialAccess.canView) return;
    router.push(`/task/${taskName}/editorial`);
  };

  return (
    <>
      <Tabs>
        <Tab page="">
          <Trans>Testo</Trans>
        </Tab>
        <Tab page="attachments">
          <Trans>Allegati</Trans>
        </Tab>
        <Tab page="tags">
          <Trans>Tags</Trans>
        </Tab>
        <Tab page="stats">
          <Trans>Statistiche</Trans>
        </Tab>
        <Tab page="submit">
          <Trans>Invia</Trans>
        </Tab>
        <Tab page="submissions">
          <Trans>Sottoposizioni</Trans>
        </Tab>
        <Tab page="help">
          <Trans>Aiuto</Trans>
        </Tab>
        {editorialAccess.hasEditorial &&
          ((editorialAccess.canView && editorialAccess.isFullySolved) ||
          (!editorialAccess.canView && editorialAccess.reason === "not_logged_in") ? (
            <Tab page="editorial">
              <Trans>Soluzione</Trans>
            </Tab>
          ) : (
            <button
              type="button"
              role="tab"
              className={clsx("tab cursor-pointer", selectedPage === "editorial" && "tab-active")}
              onClick={handleEditorialTabClick}>
              <Trans>Soluzione</Trans>
            </button>
          ))}
      </Tabs>
      {editorialAccess.hasEditorial &&
        ((editorialAccess.canView && !editorialAccess.isFullySolved) ||
          (!editorialAccess.canView && editorialAccess.reason !== "not_logged_in")) && (
          <Modal
            ref={modalRef}
            title={
              editorialAccess.canView ? t`Visualizza soluzione` : t`Soluzione non disponibile`
            }>
            {editorialAccess.canView ? (
              <>
                <p className="my-2">
                  <Trans>
                    Sei sicuro di voler consultare la soluzione del problema? Ti consigliamo di
                    continuare a provare a risolverlo autonomamente prima di consultarla.
                  </Trans>
                </p>
                <div className="modal-action">
                  <Button onClick={() => modalRef.current?.close()}>
                    <Trans>Annulla</Trans>
                  </Button>
                  <Button className="btn-primary" onClick={handleConfirm}>
                    <Trans>Visualizza soluzione</Trans>
                  </Button>
                </div>
              </>
            ) : (
              <p className="my-2">
                <Trans>
                  Per poter consultare la soluzione devi aver ottenuto un punteggio maggiore di zero
                  e non devi aver inviato soluzioni negli ultimi 7 giorni.
                </Trans>
              </p>
            )}
          </Modal>
        )}
    </>
  );
}

type TabProps = {
  page: string;
  children: ReactNode;
};

function Tab({ page, children }: TabProps) {
  const selectedPage = useSelectedLayoutSegment() ?? "";
  const { name: taskName } = useParams();

  return (
    <Link
      role="tab"
      className={clsx("tab", selectedPage === page && "tab-active")}
      href={`/task/${taskName}/${page}`}
      prefetch>
      {children}
    </Link>
  );
}
