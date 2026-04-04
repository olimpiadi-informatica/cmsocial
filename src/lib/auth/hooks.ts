import type { AuthContext } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";

import { authInternalLogger } from "~/lib/logger";

// biome-ignore lint/suspicious/useAwait: function signature is async
export const beforeHook = createAuthMiddleware(async (ctx) => {
  const newContext: Partial<AuthContext> = {
    logger: authInternalLogger(ctx.headers),
  };

  return { context: { context: newContext } };
});
