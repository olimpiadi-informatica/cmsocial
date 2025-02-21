"use client";

import Link from "next/link";

import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import {
  CheckboxField,
  CurrentPasswordField,
  Form,
  SubmitButton,
  UsernameField,
} from "@olinfo/react-components";

import { H1 } from "~/components/header";

import { login } from "./actions";

export function PageClient({ redirectUrl }: { redirectUrl: string }) {
  const { _ } = useLingui();

  const submit = async (credential: {
    username: string;
    password: string;
    keepSigned: boolean;
  }) => {
    const err = await login(
      credential.username,
      credential.password,
      credential.keepSigned,
      redirectUrl,
    );
    if (err) {
      switch (err) {
        case "login.error":
          throw new Error(_(msg`Username o password non corretti`));
        default:
          throw err;
      }
    }
    await new Promise(() => {});
  };

  return (
    <Form defaultValue={{ keepSigned: true }} onSubmit={submit}>
      <H1>
        <Trans>Accedi</Trans>
      </H1>
      <UsernameField field="username" />
      <CurrentPasswordField field="password" />
      <CheckboxField field="keepSigned" label={_(msg`Ricordami`)} optional />
      <SubmitButton>
        <Trans>Entra</Trans>
      </SubmitButton>
      <div className="mt-6 w-full">
        <Link href="/recover" className="link link-info">
          <Trans>Password dimenticata</Trans>
        </Link>
      </div>
      <div className="mt-1 w-full">
        <Link href="/signup" className="link link-info">
          <Trans>Crea un nuovo account</Trans>
        </Link>
      </div>
    </Form>
  );
}
