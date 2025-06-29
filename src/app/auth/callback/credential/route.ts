import { type NextRequest, NextResponse } from "next/server";

import { msg } from "@lingui/core/macro";

import { auth } from "~/lib/auth";
import { getAuthError } from "~/lib/auth/errors";

export async function GET(request: NextRequest): Promise<Response> {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    const messageId = msg`Token non valido`.id;
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(messageId)}`, request.url));
  }

  try {
    await auth.api.verifyEmail({
      headers: request.headers,
      query: { token },
    });
  } catch (err) {
    const messageId = getAuthError(err).id;
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(messageId)}`, request.url));
  }

  const messageId = msg`Email verificata con successo!`.id;
  return NextResponse.redirect(
    new URL(`/signup?notify=${encodeURIComponent(messageId)}`, request.url),
  );
}
