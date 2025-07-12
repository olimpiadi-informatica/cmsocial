import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import { msg } from "@lingui/core/macro";
import { logger } from "better-auth";

import { authErrors } from "~/lib/auth/errors";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest): Promise<Response> {
  const code = request.nextUrl.searchParams.get("error");
  if (!code) {
    logger.error(`Auth error: ${request.nextUrl.searchParams}`);
    const messageId = msg`Errore sconosciuto`.id;
    redirect(`/?error=${encodeURIComponent(messageId)}`);
  }

  logger.error(`Auth error: ${code}`);
  const messageId = (authErrors[code.toUpperCase()] ?? msg`Errore sconosciuto`).id;
  redirect(`/?error=${encodeURIComponent(messageId)}`);
}
