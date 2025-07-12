"use client";

import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { FirstNameField, Form, LastNameField, SubmitButton } from "@olinfo/react-components";

import { H2 } from "~/components/header";

import { updateUserProfile } from "./actions";

export default function Page() {
  const { _ } = useLingui();

  const submit = async (data: { firstName: string; lastName: string }) => {
    const err = await updateUserProfile(data.firstName, data.lastName);
    if (err) throw new Error(_(err));
    await new Promise(() => {});
  };

  return (
    <Form onSubmit={submit}>
      <H2>
        <Trans>Modifica profilo</Trans>
      </H2>
      <FirstNameField field="firstName" minLength={2} maxLength={50} pattern="^[\p{L}\s'\-]+$" />
      <LastNameField field="lastName" minLength={2} maxLength={50} pattern="^[\p{L}\s'\-]+$" />
      <SubmitButton>
        <Trans>Aggiorna dati</Trans>
      </SubmitButton>
    </Form>
  );
}
