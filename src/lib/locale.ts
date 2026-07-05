import { cookies, headers } from "next/headers";
import { cache } from "react";

import { type I18n, type Messages, setupI18n } from "@lingui/core";
import { setI18n } from "@lingui/react/server";
import { resolveAcceptLanguage } from "resolve-accept-language";

const locales = import.meta.glob("locales/*.po", { import: "messages", base: ".." }) as Record<
  string,
  () => Promise<Messages>
>;

const supportedLocales = Object.keys(locales).map((path) =>
  path.replace(/^\.\.\/locales\/(.*)\.po$/, "$1"),
);

export const loadLocale = cache(async (): Promise<I18n> => {
  const locale = await resolveLocale();

  const messages = await locales[`../locales/${locale}.po`]();
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
