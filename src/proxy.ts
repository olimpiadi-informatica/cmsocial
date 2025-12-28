import { after, type NextRequest, NextResponse } from "next/server";

import { logRequest } from "./lib/logger";
import { getSessionUser } from "./lib/user";

export function proxy(request: NextRequest) {
  const trace = crypto.randomUUID();

  const headers = new Headers(request.headers);
  headers.set("x-trace", trace);

  after(async () => {
    const user = await getSessionUser(true, headers);
    await logRequest(request, user?.id, trace);
  });

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next|files|manifest.webmanifest|icon0.svg).*)"],
};
