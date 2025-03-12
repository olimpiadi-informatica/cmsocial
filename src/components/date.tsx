"use client";

import dynamic from "next/dynamic";

import { useLingui } from "@lingui/react";

const DateTimeWithLocale = dynamic(
  () => import("@olinfo/react-components").then((m) => m.DateTime),
  { ssr: false },
);

export const DateTime: typeof DateTimeWithLocale = (props) => {
  const { i18n } = useLingui();
  return <DateTimeWithLocale {...props} locale={i18n.locale} />;
};

const DateDistanceWithLocale = dynamic(
  () => import("@olinfo/react-components").then((m) => m.DateDistance),
  { ssr: false },
);

export const DateDistance: typeof DateDistanceWithLocale = (props) => {
  const { i18n } = useLingui();
  return <DateDistanceWithLocale {...props} locale={i18n.locale} />;
};
