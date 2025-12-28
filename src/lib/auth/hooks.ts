import type { AuthContext } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";

import { authInternalLogger } from "~/lib/logger";

// biome-ignore lint/suspicious/useAwait: function signature is async
export const beforeHook = createAuthMiddleware(async (ctx) => {
  const newContext: Partial<AuthContext> = {
    logger: authInternalLogger(ctx.headers),
  };

  const basePath = ctx.context.options.basePath ?? "/api/auth";
  const fromRequest = ctx.headers?.get("x-forwarded-host");
  const fromRequestProto = ctx.headers?.get("x-forwarded-proto");

  if (fromRequest && fromRequestProto) {
    const baseUrl = new URL(basePath, `${fromRequestProto}://${fromRequest}`);
    newContext.baseURL = baseUrl.href;
  }

  return { context: { context: newContext } };
});
