import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import { msg } from "@lingui/core/macro";

import { auth } from "~/lib/auth";
import { getAuthError } from "~/lib/auth/errors";

export async function GET(request: NextRequest): Promise<Response> {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    const messageId = msg`Token non valido`.id;
    redirect(`/?error=${encodeURIComponent(messageId)}`);
  }

  try {
    await auth.api.verifyEmail({
      headers: request.headers,
      query: { token },
    });
  } catch (err) {
    const messageId = (await getAuthError(err)).id;
    redirect(`/?error=${encodeURIComponent(messageId)}`);
  }

  const messageId = msg`Email verificata con successo!`.id;
  redirect(`/signup?notify=${encodeURIComponent(messageId)}`);
}
