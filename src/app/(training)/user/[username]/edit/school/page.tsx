"use client";

import { use } from "react";

import { Trans, useLingui } from "@lingui/react/macro";
import { Form, SubmitButton } from "@olinfo/react-components";

import { H2 } from "~/components/header";
import { LocationField } from "~/components/location-field";
import { getCities, getProvinces, getRegions, getSchools } from "~/lib/api/location";

import { changeSchool } from "./actions";

type Props = {
  params: Promise<{ username: string }>;
};

type Institute = {
  region: string;
  province: string;
  city: string;
  institute: string;
};

export default function Page({ params }: Props) {
  const { username } = use(params);

  const { t } = useLingui();

  const submit = async (data: Institute) => {
    const err = await changeSchool(username, data.institute.trim());
    if (err) throw new Error(err);
    await new Promise(() => {});
  };

  return (
    <Form onSubmit={submit}>
      <H2 className="mt-8">
        <Trans>Scuola di provenienza</Trans>
      </H2>
      <LocationField
        label={t`Regione`}
        field="region"
        placeholder={t`Scegli la regione`}
        id="Italy"
        fetcher={getRegions}
      />
      {({ region }) => (
        <LocationField
          label={t`Provincia`}
          field="province"
          placeholder={t`Scegli la provincia`}
          id={region}
          fetcher={getProvinces}
        />
      )}
      {({ province }) => (
        <LocationField
          label={t`Comune`}
          field="city"
          placeholder={t`Scegli il comune`}
          id={province}
          fetcher={getCities}
        />
      )}
      {({ city }) => (
        <LocationField
          label={t`Istituto`}
          field="institute"
          placeholder={t`Scegli la scuola`}
          id={city}
          fetcher={getSchools}
        />
      )}
      <SubmitButton>
        <Trans>Cambia scuola</Trans>
      </SubmitButton>
    </Form>
  );
}
