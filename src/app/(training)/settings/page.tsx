import { Trans } from "@lingui/react/macro";

import { loadLocale } from "~/lib/locale";

export default async function Page() {
  await loadLocale();

  return (
    <div className="flex flex-col justify-center text-center text-wrap text-base-content/80 h-full px-[20%]">
      <Trans>Seleziona le impostazioni da modificare</Trans>
    </div>
  );
}
