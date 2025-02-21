import { cookies } from "next/headers";

import { type I18n, setupI18n } from "@lingui/core";
import { setI18n } from "@lingui/react/server";

const locales = {
  en: () => import("@lingui/loader!~/locales/en.po"),
  it: () => import("@lingui/loader!~/locales/it.po"),
};

export async function loadLocale(): Promise<I18n> {
  let locale = cookies().get("lang")?.value ?? "";
  if (!(locale in locales)) {
    locale = "it";
  }

  const { messages } = await locales[locale as keyof typeof locales]();
  const i18n = setupI18n({ locale, messages: { [locale]: messages } });
  setI18n(i18n);

  return i18n;
}
