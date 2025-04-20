import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import { forumLogin } from "~/lib/forum/sso";
import { getSessionUser } from "~/lib/user";

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    const redirectUrl = request.nextUrl.pathname + request.nextUrl.search;
    redirect(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
  }

  const payload = request.nextUrl.searchParams.get("sso");
  const signature = request.nextUrl.searchParams.get("sig");

  let redirectUrl: string;
  try {
    redirectUrl = forumLogin(user, payload, signature);
  } catch {
    return new Response(null, { status: 400 });
  }

  redirect(redirectUrl);
}
