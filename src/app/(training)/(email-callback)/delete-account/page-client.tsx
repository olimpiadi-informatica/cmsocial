"use client";

import { useSearchParams } from "next/navigation";

import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { Form, SubmitButton } from "@olinfo/react-components";

import { H1 } from "~/components/header";

import { deleteAccount } from "./actions";

export function PageClient() {
  const { _ } = useLingui();
  const params = useSearchParams();

  const submit = async () => {
    const err = await deleteAccount(params.get("token"));
    if (err) throw new Error(_(err));
    await new Promise(() => {});
  };

  return (
    <Form onSubmit={submit}>
      <H1>
        <Trans>Elimina account</Trans>
      </H1>
      <SubmitButton className="btn-error">
        <Trans>Conferma</Trans>
      </SubmitButton>
    </Form>
  );
}
