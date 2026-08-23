"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

import { Trans, useLingui } from "@lingui/react/macro";
import { EmailField, Form, NewPasswordField, SubmitButton } from "@olinfo/react-components";
import { ArrowRight } from "lucide-react";
import { useSWRConfig } from "swr";

import { OauthButton } from "~/components/oauth/button";
import { ReCaptcha, type ReCaptchaInner } from "~/components/recaptcha";

import { step1Password, step1Social } from "./actions";

export function Step1({ captchaKey }: { captchaKey: string }) {
  const { t } = useLingui();
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const captchaRef = useRef<ReCaptchaInner>(null);

  const submit = async (user: { email: string; password: string }) => {
    const err = await step1Password(user.email, user.password, captchaRef.current?.getValue());
    if (err) throw new Error(t(err));
    router.refresh();
    await mutate(() => true, undefined, { revalidate: true });
    await new Promise(() => {});
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <Form onSubmit={submit}>
        <div className="text-center text-sm text-base-content/80">
          <Trans>Inserisci la tua email e scegli una nuova password</Trans>
        </div>
        <EmailField field="email" />
        <NewPasswordField field="password" minLength={8} maxLength={50} />
        <div className="mx-auto mt-4">
          <ReCaptcha ref={captchaRef} captchaKey={captchaKey} />
        </div>
        <SubmitButton>
          <ArrowRight size={20} />
          <Trans>Continua</Trans>
        </SubmitButton>
      </Form>
      <div className="divider my-8">
        <Trans>oppure</Trans>
      </div>
      <div className="flex flex-col gap-2">
        <OauthButton provider="olimanager" type="signup" onClick={step1Social} />
        <OauthButton provider="google" type="signup" onClick={step1Social} />
        <OauthButton provider="github" type="signup" onClick={step1Social} />
      </div>
    </div>
  );
}
