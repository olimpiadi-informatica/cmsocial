"use client";

import { useRef } from "react";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import {
  EmailField,
  FirstNameField,
  Form,
  LastNameField,
  NewPasswordField,
  SubmitButton,
  UsernameField,
} from "@olinfo/react-components";

import { H2 } from "~/components/header";
import { LocationField } from "~/components/location-field";
import { ReCaptcha, type ReCaptchaInner } from "~/components/recaptcha";
import { getCities, getProvinces, getRegions, getSchools } from "~/lib/api/location";

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

export function PageClient({ captchaKey }: { captchaKey: string }) {
  const { _ } = useLingui();
  const captchaRef = useRef<ReCaptchaInner>(null);

  const submit = async (user: FormValue) => {
    const err = await signup(
      user.email,
      user.username,
      user.password,
      user.name,
      user.surname,
      user.institute?.trim(),
      captchaRef.current?.getValue(),
    );
    if (err) throw new Error(_(err));
    await new Promise(() => {});
  };

  return (
    <Form onSubmit={submit}>
      <EmailField field="email" />
      <UsernameField field="username" minLength={4} maxLength={50} pattern="^\w+$" />
      <NewPasswordField field="password" minLength={8} maxLength={50} />
      <H2 className="mt-8">
        <Trans>Anagrafica</Trans>
      </H2>
      <FirstNameField field="name" minLength={2} maxLength={50} pattern="^[\p{L}\s'\-]+$" />
      <LastNameField field="surname" minLength={2} maxLength={50} pattern="^[\p{L}\s'\-]+$" />
      <H2 className="mt-8">
        <Trans>Scuola di provenienza (opzionale)</Trans>
      </H2>
      <LocationField
        label={_(msg`Regione`)}
        field="region"
        placeholder={_(msg`Scegli la regione`)}
        id="Italy"
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
          fetcher={getSchools}
          optional
        />
      )}
      <div className="mx-auto mt-4">
        <ReCaptcha ref={captchaRef} captchaKey={captchaKey} />
      </div>
      <SubmitButton>
        <Trans>Crea</Trans>
      </SubmitButton>
    </Form>
  );
}
