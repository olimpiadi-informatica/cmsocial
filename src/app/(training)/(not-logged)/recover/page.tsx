"use client";

import { useState } from "react";

import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import {
  EmailField,
  Form,
  SubmitButton,
  TextField,
  useNotifications,
} from "@olinfo/react-components";
import { MailOpen } from "lucide-react";

import { H1 } from "~/components/header";

import { recoverPassword } from "./actions";

export default function Page() {
  const { _ } = useLingui();
  const { notifySuccess } = useNotifications();
  const [sent, setSent] = useState(false);

  const submit = async (recover: { email: string; code: string }) => {
    const err = await recoverPassword(recover.email, recover.code);
    if (err) {
      switch (err) {
        case "No such user":
          throw new Error(_(msg`Email non registrata`), { cause: { field: "email" } });
        case "Wrong code":
          throw new Error(_(msg`Codice non valido`), { cause: { field: "code" } });
        default:
          throw err;
      }
    }

    if (recover.code) {
      await new Promise(() => {});
    } else {
      notifySuccess(_(msg`Un codice di recupero è stato inviato alla tua email`));
      setSent(true);
    }
  };

  return (
    <Form defaultValue={{ code: "" }} onSubmit={submit}>
      <H1>
        <Trans>Recupera password</Trans>
      </H1>
      <EmailField field="email" disabled={sent} />
      {sent && (
        <TextField
          field="code"
          label={_(msg`Codice di recupero`)}
          placeholder={_(msg`Inserisci il codice di recupero`)}
          autoComplete="off"
          icon={MailOpen}
        />
      )}
      <SubmitButton>{sent ? _(msg`Cambia password`) : _(msg`Invia email`)}</SubmitButton>
    </Form>
  );
}
