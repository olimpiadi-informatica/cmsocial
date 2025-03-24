import type { Instrumentation } from "next";

export const onRequestError: Instrumentation.onRequestError = (_err, request, context) => {
  console.error(`Error while processing request:
 ‣ request: ${request.method} ${request.path}
 ‣ context: ${context.routeType} ${context.routePath}`);
};
