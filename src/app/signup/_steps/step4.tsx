"use client";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { Form, FormButton, SubmitButton } from "@olinfo/react-components";
import { ArrowRight, Redo } from "lucide-react";

import { LocationField } from "~/components/location-field";
import { getCities, getProvinces, getRegions, getSchools } from "~/lib/api/location";

import { step4 } from "./actions";

type FormValue = {
  region?: string;
  province?: string;
  city?: string;
  institute?: string;
};
export function Step4() {
  const { _ } = useLingui();

  const submit = async ({ institute }: FormValue) => {
    const err = await step4(institute?.trim());
    if (err) throw new Error(_(err));
    await new Promise(() => {});
  };

  return (
    <Form onSubmit={submit}>
      <div className="text-center text-sm text-base-content/80">
        <Trans>
          Puoi facoltativamente selezionare la tua scuola, verrà mostrata nella tua pagina di
          profilo
        </Trans>
      </div>
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
      <div className="flex justify-center gap-4">
        <SubmitButton>
          <ArrowRight size={20} />
          <Trans>Continua</Trans>
        </SubmitButton>
        <FormButton onClick={() => submit({})}>
          <Redo size={20} />
          <Trans>Salta</Trans>
        </FormButton>
      </div>
    </Form>
  );
}
