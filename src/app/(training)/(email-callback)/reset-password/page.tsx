"use client";

import { useSearchParams } from "next/navigation";

import { Trans, useLingui } from "@lingui/react/macro";
import { Form, NewPasswordField, SubmitButton } from "@olinfo/react-components";

import { H1 } from "~/components/header";

import { resetPassword } from "./actions";

export default function Page() {
  const { t } = useLingui();
  const params = useSearchParams();

  const submit = async (recover: { password: string }) => {
    const err = await resetPassword(params.get("email"), recover.password, params.get("token"));
    if (err) throw new Error(t(err));
    await new Promise(() => {});
  };

  return (
    <Form onSubmit={submit}>
      <H1>
        <Trans>Recupera password</Trans>
      </H1>
      <NewPasswordField field="password" />
      <SubmitButton>
        <Trans>Cambia password</Trans>
      </SubmitButton>
    </Form>
  );
}
