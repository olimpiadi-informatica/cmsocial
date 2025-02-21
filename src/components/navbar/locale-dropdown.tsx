import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Dropdown, DropdownButton, DropdownMenu } from "@olinfo/react-components";
import { ChevronDown, Languages } from "lucide-react";

import { DropdownAction } from "./dropdown-action";

export function LocaleDropdown() {
  const { _ } = useLingui();

  return (
    <Dropdown className="dropdown-end">
      <DropdownButton className="gap-1" ariaLabel={_(msg`Cambia lingua`)}>
        <Languages size={20} />
        <ChevronDown size={18} strokeWidth={2.5} />
      </DropdownButton>
      <DropdownMenu>
        <LocaleItem lang="it">&#127470;&#127481; Italiano</LocaleItem>
        <LocaleItem lang="en">&#127468;&#127463; English</LocaleItem>
      </DropdownMenu>
    </Dropdown>
  );
}

function LocaleItem({ lang, children }: { lang: string; children: string }) {
  const { i18n } = useLingui();

  // biome-ignore lint/suspicious/useAwait: server function must be async
  async function changeLanguage(): Promise<undefined> {
    "use server";

    cookies().set("lang", lang, { maxAge: 31536000 });
    revalidatePath("/", "layout");
  }

  return (
    <DropdownAction action={changeLanguage} active={i18n.locale === lang}>
      {children}
    </DropdownAction>
  );
}
