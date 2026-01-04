import type { Instrumentation } from "next";

import { registerCron } from "~/cron";
import { outLogger } from "~/lib/logger";

export const register = () => {
  if (process.env.ENABLE_CRON_JOBS) {
    registerCron();
  }
};

export const onRequestError: Instrumentation.onRequestError = (error, request, context) => {
  const headers = Object.entries(request.headers).flatMap(([key, values]): [string, string][] => {
    if (!values) return [];
    return Array.isArray(values) ? values.map((value) => [key, value]) : [[key, values]];
  });

  outLogger.error(
    "Error while processing request",
    { error, request, context },
    new Headers(headers),
  );
};
