import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import { getSessionUser } from "~/lib/user";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<Response> {
  const redirectUrl = request.nextUrl.searchParams.get("redirect");
  if (await getSessionUser()) {
    redirect(redirectUrl || "/");
  } else {
    redirect("/signup");
  }
}
