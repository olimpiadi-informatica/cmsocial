import { cookies, headers } from "next/headers";
import { cache } from "react";

import { type I18n, setupI18n } from "@lingui/core";
import { setI18n } from "@lingui/react/server";
import { resolveAcceptLanguage } from "resolve-accept-language";

const locales = {
  "it-IT": () => import("~/locales/it-IT.po"),
  "en-GB": () => import("~/locales/en-GB.po"),
  "de-DE": () => import("~/locales/de-DE.po"),
  "es-ES": () => import("~/locales/es-ES.po"),
  "fr-FR": () => import("~/locales/fr-FR.po"),
};

export const loadLocale = cache(async (): Promise<I18n> => {
  const locale = await resolveLocale();

  const { messages } = await locales[locale as keyof typeof locales]();
  const i18n = setupI18n({ locale, messages: { [locale]: messages } });
  setI18n(i18n);

  return i18n;
});

async function resolveLocale() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("lang")?.value;
  if (cookieLocale && cookieLocale in locales) {
    return cookieLocale;
  }

  const headerList = await headers();
  const acceptLanguage = headerList.get("accept-language");
  if (acceptLanguage) {
    return resolveAcceptLanguage(acceptLanguage, Object.keys(locales), "en-GB");
  }

  return "it-IT";
}
