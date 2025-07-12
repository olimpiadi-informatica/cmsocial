import { createAuthMiddleware } from "better-auth/api";

export const baseUrlHook = createAuthMiddleware((ctx) => {
  const basePath = ctx.context.options.basePath ?? "/api/auth";

  const fromRequest = ctx.headers?.get("x-forwarded-host");
  const fromRequestProto = ctx.headers?.get("x-forwarded-proto");

  if (fromRequest && fromRequestProto) {
    const baseUrl = new URL(basePath, `${fromRequestProto}://${fromRequest}`);
    ctx.context.baseURL = baseUrl.href;
  }

  return Promise.resolve();
});
