"use client";

import { useRef } from "react";

import { Trans, useLingui } from "@lingui/react/macro";
import { EmailField, Form, SubmitButton } from "@olinfo/react-components";

import { H1 } from "~/components/header";
import { ReCaptcha, type ReCaptchaInner } from "~/components/recaptcha";

import { recoverPassword } from "./actions";

export function PageClient({ captchaKey }: { captchaKey: string }) {
  const { t } = useLingui();
  const captchaRef = useRef<ReCaptchaInner>(null);

  const submit = async (recover: { email: string }) => {
    const err = await recoverPassword(recover.email, captchaRef.current?.getValue());
    if (err) {
      throw new Error(t(err));
    }

    await new Promise(() => {});
  };

  return (
    <Form onSubmit={submit}>
      <H1>
        <Trans>Recupera password</Trans>
      </H1>
      <EmailField field="email" />
      <div className="mx-auto mt-4">
        <ReCaptcha ref={captchaRef} captchaKey={captchaKey} />
      </div>
      <SubmitButton>
        <Trans>Cambia password</Trans>
      </SubmitButton>
    </Form>
  );
}
