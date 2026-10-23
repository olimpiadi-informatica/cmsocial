import { cookies, headers } from "next/headers";
import { cache } from "react";

import { type I18n, type Messages, setupI18n } from "@lingui/core";
import { setI18n } from "@lingui/react/server";
import { resolveAcceptLanguage } from "resolve-accept-language";

const locales = {
  "it-IT": () => import("~/locales/it-IT.po"),
  "en-GB": () => import("~/locales/en-GB.po"),
  "de-DE": () => import("~/locales/de-DE.po"),
  "es-ES": () => import("~/locales/es-ES.po"),
  "fr-FR": () => import("~/locales/fr-FR.po"),
  "ro-RO": () => import("~/locales/ro-RO.po"),
  "hu-HU": () => import("~/locales/hu-HU.po"),
  "pl-PL": () => import("~/locales/pl-PL.po"),
} satisfies Record<string, () => Promise<{ messages: Messages }>>;

const supportedLocales = Object.keys(locales);

export const loadLocale = cache(async (): Promise<I18n> => {
  const locale = (await resolveLocale()) as keyof typeof locales;

  const { messages } = await locales[locale]();
  const i18n = setupI18n({ locale, messages: { [locale]: messages } });
  setI18n(i18n);

  return i18n;
});

async function resolveLocale() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("lang")?.value;
  if (cookieLocale && supportedLocales.includes(cookieLocale)) {
    return cookieLocale;
  }

  const headerList = await headers();
  const acceptLanguage = headerList.get("accept-language");
  if (acceptLanguage) {
    return resolveAcceptLanguage(acceptLanguage, supportedLocales, "en-GB");
  }

  return "it-IT";
}
