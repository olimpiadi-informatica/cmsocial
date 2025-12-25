import type { Instrumentation } from "next";

import { logger } from "~/lib/logger";

export const onRequestError: Instrumentation.onRequestError = (_err, request, context) => {
  logger.error("Error while processing request", { request, context });
};
