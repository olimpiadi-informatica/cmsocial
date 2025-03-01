"use client";

import { useRef } from "react";

import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import {
  EmailField,
  FirstNameField,
  Form,
  LastNameField,
  NewPasswordField,
  SubmitButton,
  UsernameField,
} from "@olinfo/react-components";
import type { Contest } from "@olinfo/training-api";
import ReCaptchaWidget, { type ReCAPTCHA } from "react-google-recaptcha";

import { H2 } from "~/components/header";
import { useTheme } from "~/lib/theme";

import { signup } from "./actions";

type FormValue = {
  email: string;
  username: string;
  password: string;
  name: string;
  surname: string;
  region: string;
  province: string;
  city: string;
  institute: string;
};

export function PageClient({ contest, redirectUrl }: { contest: Contest; redirectUrl: string }) {
  const theme = useTheme();
  const { _ } = useLingui();

  const captchaRef = useRef<ReCAPTCHA>(null);

  const submit = async (user: FormValue) => {
    const err = await signup(
      user.email,
      user.username,
      user.password,
      user.name,
      user.surname,
      /*user.institute*/ undefined,
      captchaRef.current?.getValue() ?? undefined,
      redirectUrl,
    );
    if (err) {
      switch (err) {
        case "Username is invalid":
          throw new Error(_(msg`Username non valido`), { cause: { field: "username" } });
        case "This username is not available":
          throw new Error(_(msg`Username non disponibile`), { cause: { field: "username" } });
        case "Invalid e-mail":
          throw new Error(_(msg`Email non valida`), { cause: { field: "email" } });
        case "E-mail already used":
          throw new Error(_(msg`Email già in uso`), { cause: { field: "email" } });
        case "Anti-spam check failed":
          throw new Error(_(msg`Captcha fallito`));
        default:
          throw err;
      }
    }
    await new Promise(() => {});
  };

  return (
    <Form onSubmit={submit}>
      <EmailField field="email" />
      <UsernameField field="username" minLength={4} />
      <NewPasswordField field="password" minLength={8} />
      <H2 className="mt-8">
        <Trans>Anagrafica</Trans>
      </H2>
      <FirstNameField field="name" />
      <LastNameField field="surname" />
      {/* <H2 className="mt-8">
        <Trans>Scuola di provenienza (opzionale)</Trans>
      </H2>
      <LocationField
        label={_(msg`Regione`)}
        field="region"
        placeholder={_(msg`Scegli la regione`)}
        id="🇮"
        fetcher={getRegions}
        optional
      />
      {({ region }) => (
        <LocationField
          label={_(msg`Provincia`)}
          field="province"
          placeholder={_(msg`Scegli la provincia`)}
          id={region}
          fetcher={getProvinces}
          optional
        />
      )}
      {({ province }) => (
        <LocationField
          label={_(msg`Comune`)}
          field="city"
          placeholder={_(msg`Scegli il comune`)}
          id={province}
          fetcher={getCities}
          optional
        />
      )}
      {({ city }) => (
        <LocationField
          label={_(msg`Istituto`)}
          field="institute"
          placeholder={_(msg`Scegli la scuola`)}
          id={city}
          fetcher={getInstitutes}
          optional
        />
      )} */}
      {contest.captcha_enabled && (
        <div className="mx-auto mt-4 h-20">
          {theme && (
            <ReCaptchaWidget
              ref={captchaRef}
              theme={theme}
              className="h-[76px] w-[302px] overflow-hidden rounded-[3px]"
              sitekey={
                process.env.NODE_ENV === "production"
                  ? contest.recaptcha_public_key
                  : "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              }
            />
          )}
        </div>
      )}
      <SubmitButton>
        <Trans>Crea</Trans>
      </SubmitButton>
    </Form>
  );
}
