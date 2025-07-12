import { redirect } from "next/navigation";

import { Trans } from "@lingui/react/macro";

import { H2 } from "~/components/header";
import { OauthButton } from "~/components/oauth/button";
import { loadLocale } from "~/lib/locale";
import { getSessionUser, getUserProviders } from "~/lib/user";

import { linkAccount, unlinkAccount } from "./actions";

const SOCIAL_PROVIDERS = ["olimanager", "google", "github"] as const;

export default async function Page() {
  await loadLocale();

  const user = await getSessionUser();
  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent("/settings/social")}`);
  }

  const providers = await getUserProviders();

  const nonLinked = SOCIAL_PROVIDERS.filter((provider) => !providers.includes(provider));
  const linked = SOCIAL_PROVIDERS.filter((provider) => providers.includes(provider));

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
      {nonLinked.length > 0 && (
        <div className="flex flex-col gap-2">
          <H2>
            <Trans>Collega account</Trans>
          </H2>
          {nonLinked.map((provider) => (
            <OauthButton key={provider} provider={provider} type="link" onClick={linkAccount} />
          ))}
        </div>
      )}
      {linked.length > 0 && (
        <div className="flex flex-col gap-2">
          <H2>
            <Trans>Account collegati</Trans>
          </H2>
          {linked.map((provider) => (
            <OauthButton
              key={provider}
              provider={provider}
              type="unlink"
              onClick={unlinkAccount}
              disabled={providers.length === 1 || provider === "olimanager"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
