import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import { msg } from "@lingui/core/macro";

import { authErrors } from "~/lib/auth/errors";
import { logger } from "~/lib/logger";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest): Promise<Response> {
  logger.error("Auth error", { request });

  let messageId = msg`Errore sconosciuto`;

  const code = request.nextUrl.searchParams.get("error")?.toUpperCase();
  if (!code) {
    logger.error("Missing auth error code", { request });
  } else if (code in authErrors) {
    messageId = authErrors[code];
  } else {
    logger.error("Missing auth code", { code });
  }

  logger.error("Auth error", { code });
  redirect(`/?error=${encodeURIComponent(messageId.id)}`);
}
