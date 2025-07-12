import type { NextRequest } from "next/server";

import { auth } from "~/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
): Promise<Response> {
  const { provider } = await params;

  return auth.api.oAuth2Callback({
    headers: request.headers,
    params: { providerId: provider },
    query: Object.fromEntries(request.nextUrl.searchParams.entries()),
    asResponse: true,
  });
}
