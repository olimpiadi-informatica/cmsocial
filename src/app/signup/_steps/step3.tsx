"use client";

import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import {
  FirstNameField,
  Form,
  LastNameField,
  SubmitButton,
  UsernameField,
} from "@olinfo/react-components";
import { ArrowRight } from "lucide-react";

import { step3 } from "./actions";

export function Step3() {
  const { _ } = useLingui();

  const submit = async (user: { username: string; firstName: string; lastName: string }) => {
    const err = await step3(user.username, user.firstName, user.lastName);
    if (err) throw new Error(_(err));
    await new Promise(() => {});
  };

  return (
    <Form onSubmit={submit}>
      <div className="text-center text-sm text-base-content/80">
        <Trans>Inserisci il tuo nome e cognome e scegli un username</Trans>
      </div>
      <UsernameField field="username" minLength={5} maxLength={39} pattern="^\w+$" />
      <FirstNameField field="firstName" minLength={2} maxLength={50} pattern="^[\p{L}\s'\-]+$" />
      <LastNameField field="lastName" minLength={2} maxLength={50} pattern="^[\p{L}\s'\-]+$" />
      <SubmitButton>
        <ArrowRight size={20} />
        <Trans>Continua</Trans>
      </SubmitButton>
    </Form>
  );
}
