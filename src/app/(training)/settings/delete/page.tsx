"use client";

import { msg } from "@lingui/core/macro";
import { Trans, useLingui } from "@lingui/react/macro";
import { Form, SubmitButton, TextField } from "@olinfo/react-components";
import { TriangleAlert } from "lucide-react";

import { H2 } from "~/components/header";

import { deleteUser } from "./actions";

const CORRECT_CONFIRMATION = msg`Voglio cancellare il mio account`;

export default function Page() {
  const { t } = useLingui();

  const submit = async () => {
    const err = await deleteUser();
    if (err) throw new Error(t(err));
    await new Promise(() => {});
  };

  return (
    <Form onSubmit={submit}>
      <H2 className="text-error">
        <Trans>Eliminazione account</Trans>
      </H2>
      <div className="w-full my-2">
        <Trans>Per continuare, inserisci la frase di conferma:</Trans>
      </div>
      <div className="text-center font-mono text-sm select-none mb-4">
        {t(CORRECT_CONFIRMATION)}
      </div>
      <TextField
        label={t`Frase di conferma`}
        field="confirmation"
        placeholder={t`Inserisci la frase di conferma`}
      />
      {({ confirmation }) => (
        <SubmitButton className="btn-error" disabled={confirmation !== t(CORRECT_CONFIRMATION)}>
          <Trans>Elimina account</Trans>
        </SubmitButton>
      )}
      <div className="mt-4">
        <TriangleAlert size={18} className="inline-block text-error mr-2 mb-1" />
        <Trans>Attenzione! Questa azione è irreversibile.</Trans>
      </div>
    </Form>
  );
}
