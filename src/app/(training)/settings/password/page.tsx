"use client";

import { Trans, useLingui } from "@lingui/react/macro";
import {
  CurrentPasswordField,
  Form,
  NewPasswordField,
  SubmitButton,
} from "@olinfo/react-components";

import { H2 } from "~/components/header";

import { changePassword } from "./actions";

export default function Page() {
  const { t } = useLingui();

  const submit = async (data: { currentPassword: string; newPassword: string }) => {
    const err = await changePassword(data.currentPassword, data.newPassword);
    if (err) throw new Error(t(err));
    await new Promise(() => {});
  };

  return (
    <Form onSubmit={submit}>
      <H2>
        <Trans>Modifica password</Trans>
      </H2>
      <CurrentPasswordField field="currentPassword" label={t`Vecchia password`} />
      <NewPasswordField field="newPassword" label={t`Nuova password`} minLength={8} />
      <SubmitButton>
        <Trans>Modifica password</Trans>
      </SubmitButton>
    </Form>
  );
}
