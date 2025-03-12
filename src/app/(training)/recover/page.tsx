"use client";

import { useState } from "react";

import { Trans, useLingui } from "@lingui/react/macro";
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
  const { t } = useLingui();
  const { notifySuccess } = useNotifications();
  const [sent, setSent] = useState(false);

  const submit = async (recover: { email: string; code: string }) => {
    const err = await recoverPassword(recover.email, recover.code);
    if (err) {
      switch (err) {
        case "No such user":
          throw new Error(t`Email non registrata`, { cause: { field: "email" } });
        case "Wrong code":
          throw new Error(t`Codice non valido`, { cause: { field: "code" } });
        default:
          throw err;
      }
    }

    if (recover.code) {
      await new Promise(() => {});
    } else {
      notifySuccess(t`Un codice di recupero è stato inviato alla tua email`);
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
          label={t`Codice di recupero`}
          placeholder={t`Inserisci il codice di recupero`}
          autoComplete="off"
          icon={MailOpen}
        />
      )}
      <SubmitButton>{sent ? t`Cambia password` : t`Invia email`}</SubmitButton>
    </Form>
  );
}
