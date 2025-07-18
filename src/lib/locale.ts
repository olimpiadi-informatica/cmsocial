import { cookies } from "next/headers";
import { cache } from "react";

import { type I18n, setupI18n } from "@lingui/core";
import { setI18n } from "@lingui/react/server";

const locales = {
  en: () => import("~/locales/en.po"),
  it: () => import("~/locales/it.po"),
};

export const loadLocale = cache(async (): Promise<I18n> => {
  let locale = (await cookies()).get("lang")?.value ?? "";
  if (!(locale in locales)) {
    locale = "it";
  }

  const { messages } = await locales[locale as keyof typeof locales]();
  const i18n = setupI18n({ locale, messages: { [locale]: messages } });
  setI18n(i18n);

  return i18n;
});
