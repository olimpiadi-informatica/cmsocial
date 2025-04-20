"use client";

import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { CurrentPasswordField, EmailField, Form, SubmitButton } from "@olinfo/react-components";

import { H2 } from "~/components/header";

import { changeEmail } from "./actions";

export default function Page() {
  const { _ } = useLingui();

  const submit = async (data: { password: string; email: string }) => {
    const err = await changeEmail(data.password, data.email);
    if (err) throw new Error(_(err));
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
