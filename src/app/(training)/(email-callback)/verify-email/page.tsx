"use client";

import { useSearchParams } from "next/navigation";

import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { Form, SubmitButton } from "@olinfo/react-components";

import { H1 } from "~/components/header";

import { verifyEmail } from "./actions";

export default function Page() {
  const { _ } = useLingui();
  const params = useSearchParams();

  const submit = async () => {
    const err = await verifyEmail(params.get("token"));
    if (err) throw new Error(_(err));
    await new Promise(() => {});
  };

  return (
    <Form onSubmit={submit} className="max-w-none">
      <H1>
        <Trans>Verifica email</Trans>
      </H1>
      <div className="text-center w-full my-2">
        <Trans>Premi conferma per completare la verifica della tua email</Trans>
      </div>
      <SubmitButton>
        <Trans>Conferma</Trans>
      </SubmitButton>
    </Form>
  );
}
