"use client";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import {
  CheckboxField,
  CurrentPasswordField,
  Form,
  SubmitButton,
  UsernameField,
} from "@olinfo/react-components";

import { Link } from "~/components/link";

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
    if (err) throw new Error(_(err));
    await new Promise(() => {});
  };

  return (
    <Form defaultValue={{ keepSigned: true }} onSubmit={submit}>
      <UsernameField field="username" />
      <CurrentPasswordField field="password" />
      <CheckboxField field="keepSigned" label={_(msg`Ricordami`)} optional />
      <SubmitButton>
        <Trans>Entra</Trans>
      </SubmitButton>
      <div className="mt-6 w-full">
        <Link href="/forgot-password" className="link link-info">
          <Trans>Password dimenticata</Trans>
        </Link>
      </div>
    </Form>
  );
}
