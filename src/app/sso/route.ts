import { createHmac } from "node:crypto";

import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import { getSessionUser } from "~/lib/user";

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    const redirectUrl = request.nextUrl.pathname + request.nextUrl.search;
    redirect(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
  }

  const payload = request.nextUrl.searchParams.get("sso");
  const signature = request.nextUrl.searchParams.get("sig");

  if (!payload || !signature || hmac(payload) !== signature) {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  const decodedPayload = new URLSearchParams(fromBase64(payload));
  const nonce = decodedPayload.get("nonce")!;
  const returnSsoUrl = decodedPayload.get("return_sso_url")!;

  const parameters = new URLSearchParams({
    nonce,
    external_id: user.username, // Using username was a bad idea...
    email: user.email,
    username: user.username,
    name: user.name,
    avatar_url: user.image,
    avatar_force_update: "true",
  });

  const responsePayload = toBase64(parameters.toString());

  const url = new URL(returnSsoUrl);
  url.searchParams.set("sso", responsePayload);
  url.searchParams.set("sig", hmac(responsePayload));
  redirect(url.href);
}

function fromBase64(base64: string): string {
  return Buffer.from(base64, "base64").toString("utf-8");
}

function toBase64(str: string): string {
  return Buffer.from(str).toString("base64");
}

function hmac(payload: string): string {
  return createHmac("sha256", process.env.AUTH_SECRET!).update(payload).digest("hex");
}
