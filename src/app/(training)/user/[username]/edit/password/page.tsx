"use client";

import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import {
  CurrentPasswordField,
  Form,
  NewPasswordField,
  SubmitButton,
} from "@olinfo/react-components";

import { H2 } from "~/components/header";

import { changePassword } from "./actions";

type Props = {
  params: { username: string };
};

export default function Page({ params: { username } }: Props) {
  const { _ } = useLingui();

  const submit = async (data: { oldPassword: string; newPassword: string }) => {
    const err = await changePassword(username, data.oldPassword, data.newPassword);
    if (err) {
      switch (err) {
        case "Wrong password":
          throw new Error(_(msg`Password non corretta`), { cause: { field: "oldPassword" } });
        default:
          throw err;
      }
    }
    await new Promise(() => {});
  };

  return (
    <Form onSubmit={submit}>
      <H2>
        <Trans>Modifica password</Trans>
      </H2>
      <CurrentPasswordField field="oldPassword" label={_(msg`Vecchia password`)} />
      <NewPasswordField field="newPassword" label={_(msg`Nuova password`)} minLength={8} />
      <SubmitButton>
        <Trans>Modifica password</Trans>
      </SubmitButton>
    </Form>
  );
}
