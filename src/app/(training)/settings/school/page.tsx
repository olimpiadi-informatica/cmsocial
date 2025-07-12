"use client";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { Form, SubmitButton } from "@olinfo/react-components";

import { H2 } from "~/components/header";
import { LocationField } from "~/components/location-field";
import { getCities, getProvinces, getRegions, getSchools } from "~/lib/api/location";

import { updateSchool } from "./actions";

type Institute = {
  region: string;
  province: string;
  city: string;
  institute: string;
};

export default function Page() {
  const { _ } = useLingui();

  const submit = async (data: Institute) => {
    const err = await updateSchool(data.institute.trim());
    if (err) throw new Error(_(err));
    await new Promise(() => {});
  };

  return (
    <Form onSubmit={submit}>
      <H2>
        <Trans>Modifica scuola</Trans>
      </H2>
      <LocationField
        label={_(msg`Regione`)}
        field="region"
        placeholder={_(msg`Scegli la regione`)}
        id="Italy"
        fetcher={getRegions}
      />
      {({ region }) => (
        <LocationField
          label={_(msg`Provincia`)}
          field="province"
          placeholder={_(msg`Scegli la provincia`)}
          id={region}
          fetcher={getProvinces}
        />
      )}
      {({ province }) => (
        <LocationField
          label={_(msg`Comune`)}
          field="city"
          placeholder={_(msg`Scegli il comune`)}
          id={province}
          fetcher={getCities}
        />
      )}
      {({ city }) => (
        <LocationField
          label={_(msg`Istituto`)}
          field="institute"
          placeholder={_(msg`Scegli la scuola`)}
          id={city}
          fetcher={getSchools}
        />
      )}
      <SubmitButton>
        <Trans>Aggiorna scuola</Trans>
      </SubmitButton>
    </Form>
  );
}
