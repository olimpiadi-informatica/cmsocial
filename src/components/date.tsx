"use client";

import { useEffect, useState } from "react";

import { useLingui } from "@lingui/react/macro";
import { DateDistance as DateDistanceWithLocale } from "@olinfo/react-components";
import clsx from "clsx";
import { intlFormat, intlFormatDistance } from "date-fns";

type DateProps = {
  date: Date;
  dateStyle?: Intl.DateTimeFormatOptions["dateStyle"] | "hidden";
  timeStyle?: Intl.DateTimeFormatOptions["timeStyle"] | "hidden";
  className?: string;
};

function style(
  dateStyle: DateProps["dateStyle"],
  timeStyle: DateProps["timeStyle"],
  timeZone = "UTC",
) {
  return {
    dateStyle: dateStyle === "hidden" ? undefined : dateStyle,
    timeStyle: timeStyle === "hidden" ? undefined : timeStyle,
    timeZone,
  };
}

export function DateTime({
  date,
  dateStyle = "medium",
  timeStyle = "short",
  className,
}: DateProps) {
  const { i18n } = useLingui();

  const [timeZone, setTimeZone] = useState<string | undefined>();

  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const formatted = intlFormat(date, style(dateStyle, timeStyle, timeZone), {
    locale: i18n.locale,
  });
  const duration = intlFormatDistance(date, new Date(), { locale: i18n.locale });

  return (
    <abbr title={duration} className={clsx(className, !timeZone && "opacity-0")}>
      {formatted}
    </abbr>
  );
}

export const DateDistance: typeof DateDistanceWithLocale = (props) => {
  const { i18n } = useLingui();
  return <DateDistanceWithLocale {...props} locale={i18n.locale} />;
};
