"use client";

import type { Ref } from "react";

import { Trans, useLingui } from "@lingui/react/macro";
import { Modal } from "@olinfo/react-components";

import { Link } from "~/components/link";

export function GuidelinesModal({
  ref,
  redirectTo,
}: {
  ref: Ref<HTMLDialogElement>;
  redirectTo: string;
}) {
  const { t } = useLingui();

  return (
    <Modal ref={ref} title={t`Linee guida`}>
      <Trans>
        Per inviare le soluzioni è necessario leggere le{" "}
        <Link
          href={`/guidelines?redirect=${encodeURIComponent(redirectTo)}`}
          className="link link-info">
          linee guida
        </Link>{" "}
        e accettare le condizioni.
      </Trans>
    </Modal>
  );
}
