import { hrtime } from "node:process";

import { after, type NextRequest, NextResponse } from "next/server";

import { logRequest } from "./lib/logger";
import { getSessionUser } from "./lib/user";

export function proxy(request: NextRequest) {
  const timestamp = hrtime.bigint();
  const trace = crypto.randomUUID();

  const headers = new Headers(request.headers);
  headers.set("x-trace", trace);
  const response = NextResponse.next({ request: { headers } });

  after(async () => {
    const latency = hrtime.bigint() - timestamp;
    const user = await getSessionUser();
    await logRequest(request, response, user?.id ?? "", trace, latency);
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next|files|manifest.webmanifest|icon0.svg).*)"],
};
