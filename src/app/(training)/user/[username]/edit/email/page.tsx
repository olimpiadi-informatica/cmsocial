"use client";

import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { CurrentPasswordField, EmailField, Form, SubmitButton } from "@olinfo/react-components";

import { H2 } from "~/components/header";

import { changeEmail } from "./actions";

type Props = {
  params: { username: string };
};

export default function Page({ params: { username } }: Props) {
  const { _ } = useLingui();

  const submit = async (data: { password: string; email: string }) => {
    const err = await changeEmail(username, data.password, data.email);
    if (err) {
      switch (err) {
        case "login.error":
          throw new Error(_(msg`Password non corretta`), { cause: { field: "password" } });
        case "Invalid e-mail":
          throw new Error(_(msg`Email non valida`), { cause: { field: "email" } });
        case "E-mail already used":
          throw new Error(_(msg`Email già in uso`), { cause: { field: "email" } });
        default:
          throw err;
      }
    }
    await new Promise(() => {});
  };

  return (
    <Form onSubmit={submit}>
      <H2>
        <Trans>Modifica email</Trans>
      </H2>
      <CurrentPasswordField field="password" />
      <EmailField field="email" />
      <SubmitButton>
        <Trans>Modifica email</Trans>
      </SubmitButton>
    </Form>
  );
}
