"use client";

import { useRef } from "react";

import { Trans, useLingui } from "@lingui/react/macro";
import {
  EmailField,
  FirstNameField,
  Form,
  LastNameField,
  NewPasswordField,
  SubmitButton,
  UsernameField,
} from "@olinfo/react-components";
import ReCaptchaWidget, { type ReCAPTCHA } from "react-google-recaptcha";

import { H2 } from "~/components/header";
import { LocationField } from "~/components/location-field";
import { getCities, getProvinces, getRegions, getSchools } from "~/lib/api/location";
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
  institute?: string;
};

export function PageClient({
  redirectUrl,
  captchaKey,
}: { redirectUrl: string; captchaKey?: string }) {
  const theme = useTheme();
  const { t } = useLingui();

  const captchaRef = useRef<ReCAPTCHA>(null);

  const submit = async (user: FormValue) => {
    const err = await signup(
      user.email,
      user.username,
      user.password,
      user.name,
      user.surname,
      user.institute?.trim(),
      captchaRef.current?.getValue() ?? undefined,
      redirectUrl,
    );
    if (err) {
      switch (err) {
        case "Username is invalid":
          throw new Error(t`Username non valido`, { cause: { field: "username" } });
        case "This username is not available":
          throw new Error(t`Username non disponibile`, { cause: { field: "username" } });
        case "Invalid e-mail":
          throw new Error(t`Email non valida`, { cause: { field: "email" } });
        case "E-mail already used":
          throw new Error(t`Email già in uso`, { cause: { field: "email" } });
        case "Anti-spam check failed":
          throw new Error(t`Captcha fallito`);
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
      <H2 className="mt-8">
        <Trans>Scuola di provenienza (opzionale)</Trans>
      </H2>
      <LocationField
        label={t`Regione`}
        field="region"
        placeholder={t`Scegli la regione`}
        id="Italy"
        fetcher={getRegions}
        optional
      />
      {({ region }) => (
        <LocationField
          label={t`Provincia`}
          field="province"
          placeholder={t`Scegli la provincia`}
          id={region}
          fetcher={getProvinces}
          optional
        />
      )}
      {({ province }) => (
        <LocationField
          label={t`Comune`}
          field="city"
          placeholder={t`Scegli il comune`}
          id={province}
          fetcher={getCities}
          optional
        />
      )}
      {({ city }) => (
        <LocationField
          label={t`Istituto`}
          field="institute"
          placeholder={t`Scegli la scuola`}
          id={city}
          fetcher={getSchools}
          optional
        />
      )}
      {captchaKey && (
        <div className="mx-auto mt-4 h-20">
          {theme && (
            <ReCaptchaWidget
              ref={captchaRef}
              theme={theme}
              className="h-[76px] w-[302px] overflow-hidden rounded-[3px]"
              sitekey={captchaKey}
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
