import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { ReactNode } from "react";

import { useLingui } from "@lingui/react/macro";
import { Dropdown, DropdownButton, DropdownMenu } from "@olinfo/react-components";
import { ChevronDown, Languages } from "lucide-react";

import { Flag } from "~/components/flags";

import { DropdownAction } from "./dropdown-action";

export function LocaleDropdown() {
  const { t } = useLingui();

  return (
    <Dropdown className="dropdown-end">
      <DropdownButton className="gap-1" ariaLabel={t`Cambia lingua`}>
        <Languages size={20} />
        <ChevronDown size={18} strokeWidth={2.5} />
      </DropdownButton>
      <DropdownMenu>
        <LocaleItem lang="it-IT">
          <Flag locale="it" /> Italiano
        </LocaleItem>
        <LocaleItem lang="en-GB">
          <Flag locale="gb" /> English
        </LocaleItem>
        <LocaleItem lang="de-DE">
          <Flag locale="de" /> Deutsch (beta)
        </LocaleItem>
        <LocaleItem lang="es-ES">
          <Flag locale="es" /> Español (beta)
        </LocaleItem>
        <LocaleItem lang="fr-FR">
          <Flag locale="fr" /> Français (beta)
        </LocaleItem>
      </DropdownMenu>
    </Dropdown>
  );
}

function LocaleItem({ lang, children }: { lang: string; children: ReactNode }) {
  const { i18n } = useLingui();

  async function changeLanguage(): Promise<undefined> {
    "use server";

    (await cookies()).set("lang", lang, { maxAge: 31536000 });
    revalidatePath("/", "layout");
  }

  return (
    <DropdownAction action={changeLanguage} active={i18n.locale === lang}>
      {children}
    </DropdownAction>
  );
}
