"use client";

import { use } from "react";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
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

  const { _ } = useLingui();

  const submit = async (data: Institute) => {
    const err = await changeSchool(username, data.institute.trim());
    if (err) throw new Error(_(err));
    await new Promise(() => {});
  };

  return (
    <Form onSubmit={submit}>
      <H2 className="mt-8">
        <Trans>Scuola di provenienza</Trans>
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
        <Trans>Cambia scuola</Trans>
      </SubmitButton>
    </Form>
  );
}
