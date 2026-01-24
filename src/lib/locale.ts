import { cookies, headers } from "next/headers";
import { cache } from "react";

import { type I18n, type Messages, setupI18n } from "@lingui/core";
import { setI18n } from "@lingui/react/server";
import { resolveAcceptLanguage } from "resolve-accept-language";

export type Locale = "it-IT" | "en-GB" | "de-DE" | "es-ES" | "fr-FR" | "ro-RO" | "hu-HU" | "pl-PL";

const locales: Record<Locale, () => Promise<{ messages: Messages }>> = {
  "it-IT": () => import("~/locales/it-IT.po"),
  "en-GB": () => import("~/locales/en-GB.po"),
  "de-DE": () => import("~/locales/de-DE.po"),
  "es-ES": () => import("~/locales/es-ES.po"),
  "fr-FR": () => import("~/locales/fr-FR.po"),
  "ro-RO": () => import("~/locales/ro-RO.po"),
  "hu-HU": () => import("~/locales/hu-HU.po"),
  "pl-PL": () => import("~/locales/pl-PL.po"),
};

export const loadLocale = cache(async (): Promise<I18n> => {
  const locale = await resolveLocale();

  const i18n = await setupLocale(locale);
  setI18n(i18n);

  return i18n;
});

export async function setupLocale(locale: Locale) {
  const { messages } = await locales[locale]();
  return setupI18n({ locale, messages: { [locale]: messages } });
}

async function resolveLocale() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("lang")?.value;
  if (cookieLocale && cookieLocale in locales) {
    return cookieLocale as Locale;
  }

  const headerList = await headers();
  const acceptLanguage = headerList.get("accept-language");
  if (acceptLanguage) {
    return resolveAcceptLanguage(acceptLanguage, Object.keys(locales) as Locale[], "en-GB");
  }

  return "it-IT";
}
