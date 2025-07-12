"use client";

import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { CurrentPasswordField, Form, SubmitButton, UsernameField } from "@olinfo/react-components";

import { H2 } from "~/components/header";
import { Link } from "~/components/link";
import { OauthButton } from "~/components/oauth/button";

import { loginOAuth, loginPassword, loginSocial } from "./actions";

export function PageClient({ redirectUrl }: { redirectUrl: string }) {
  const { _ } = useLingui();

  const submit = async (credential: { username: string; password: string }) => {
    const err = await loginPassword(credential.username, credential.password, redirectUrl);
    if (err) throw new Error(_(err));
    await new Promise(() => {});
  };

  const loginOAuthRedirect = (provider: string) => loginOAuth(provider, redirectUrl);
  const loginSocialRedirect = (provider: string) => loginSocial(provider, redirectUrl);

  return (
    <div className="w-full max-w-sm mx-auto">
      <Form onSubmit={submit}>
        <H2>
          <Trans>Accedi</Trans>
        </H2>
        <UsernameField field="username" />
        <CurrentPasswordField field="password" />
        <div className="mt-2 px-2 w-full text-xs">
          <Link href="/forgot-password" className="link link-info">
            <Trans>Password dimenticata?</Trans>
          </Link>
        </div>
        <SubmitButton>
          <Trans>Entra</Trans>
        </SubmitButton>
        <div className="mt-6 mb-2 px-2 w-full text-center">
          <Trans>
            Non hai un account?{" "}
            <Link href="/signup" className="link link-info">
              Registrati
            </Link>
          </Trans>
        </div>
      </Form>
      <div className="divider">
        <Trans>oppure</Trans>
      </div>
      <div className="flex flex-col gap-2">
        <OauthButton provider="olimanager" type="login" onClick={loginOAuthRedirect} />
        <OauthButton provider="google" type="login" onClick={loginSocialRedirect} />
        <OauthButton provider="github" type="login" onClick={loginSocialRedirect} />
      </div>
    </div>
  );
}
