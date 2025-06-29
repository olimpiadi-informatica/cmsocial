import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Trans } from "@lingui/react/macro";
import clsx from "clsx";

import { RegistrationStep } from "~/lib/auth/types";
import { loadLocale } from "~/lib/locale";
import { getSessionUser } from "~/lib/user";

import { Step1 } from "./_steps/step1";
import { Step2 } from "./_steps/step2";
import { Step3 } from "./_steps/step3";
import { Step4 } from "./_steps/step4";
import { Step5 } from "./_steps/step5";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Training - Registrazione",
};

export default async function Page() {
  await loadLocale();
  const step = await getStep();

  return (
    <>
      <ul className="steps mx-auto">
        <Step stage={RegistrationStep.Credential}>
          <Trans>Credenziali</Trans>
        </Step>
        <Step stage={RegistrationStep.Verification}>
          <Trans>Verifica email</Trans>
        </Step>
        <Step stage={RegistrationStep.Profile}>
          <Trans>Profilo</Trans>
        </Step>
        <Step stage={RegistrationStep.School}>
          <Trans>Scuola</Trans>
        </Step>
        <Step stage={RegistrationStep.Completed}>
          <Trans>Fine</Trans>
        </Step>
      </ul>
      {step === RegistrationStep.Credential && (
        <Step1 captchaKey={process.env.CAPTCHA_PUBLIC_KEY!} />
      )}
      {step === RegistrationStep.Verification && <Step2 />}
      {step === RegistrationStep.Profile && <Step3 />}
      {step === RegistrationStep.School && <Step4 />}
      {step === RegistrationStep.Completed && <Step5 />}
    </>
  );
}

async function Step({ stage, children }: { stage: RegistrationStep; children: ReactNode }) {
  const step = await getStep();
  return (
    <li className={clsx("step", step >= stage && "step-primary")}>
      <div className="px-4">{children}</div>
    </li>
  );
}

async function getStep() {
  const user = await getSessionUser(true);
  if (!user) return RegistrationStep.Credential;
  if (!user.emailVerified) return RegistrationStep.Verification;
  return user.registrationStep;
}
