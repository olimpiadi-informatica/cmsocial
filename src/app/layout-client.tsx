"use client";

import { type ReactNode, useEffect, useMemo } from "react";

import { type Messages, setupI18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { useNotifications } from "@olinfo/react-components";
import { useRouter, useSearchParams } from "next/navigation";
import { SWRConfig } from "swr";

type LayoutProps = {
  locale: string;
  messages: Messages;
  children: ReactNode;
};

export function LayoutClient({ locale, messages, children }: LayoutProps) {
  const { notifySuccess, notifyError } = useNotifications();

  const i18n = useMemo(() => {
    return setupI18n({
      locale,
      messages: { [locale]: messages },
    });
  }, [locale, messages]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const notify = useMemo(() => searchParams.get("notify"), [searchParams]);
  useEffect(() => {
    if (notify) {
      notifySuccess(i18n._(notify));
      const url = new URL(window.location.href);
      url.searchParams.delete("notify");
      router.replace(url.href);
    }
  }, [notify, notifySuccess, i18n, router]);

  return (
    <I18nProvider i18n={i18n}>
      <SWRConfig value={{ onError: notifyError }}>{children}</SWRConfig>
    </I18nProvider>
  );
}
