"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useEffect } from "react";

import { type Messages, setupI18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { useNotifications } from "@olinfo/react-components";
import { SWRConfig } from "swr";

type LayoutProps = {
  locale: string;
  messages: Messages;
  children: ReactNode;
};

export function LayoutClient({ locale, messages, children }: LayoutProps) {
  const { notifySuccess, notifyError } = useNotifications();

  const i18n = setupI18n({
    locale,
    messages: { [locale]: messages },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const removeSearchParam = (name: string) => {
      const url = new URL(window.location.href);
      url.searchParams.delete(name);
      router.replace(url.href);
    };

    const success = searchParams.get("notify");
    if (success) {
      notifySuccess(i18n._(success));
      removeSearchParam("notify");
    }

    const error = searchParams.get("error");
    if (error) {
      notifyError(new Error(i18n._(error)));
      removeSearchParam("error");
    }
  }, [searchParams, router, notifySuccess, notifyError, i18n]);

  return (
    <I18nProvider i18n={i18n}>
      <SWRConfig value={{ onError: notifyError }}>{children}</SWRConfig>
    </I18nProvider>
  );
}
