import { createHmac } from "node:crypto";

import type { User } from "~/lib/auth/types";

export function forumLogin(user: User, payload: string | null, signature: string | null): string {
  if (!payload || !signature || hmac(payload) !== signature) {
    throw new Error("Invalid signature");
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
  return url.href;
}

function fromBase64(base64: string): string {
  return Buffer.from(base64, "base64").toString("utf-8");
}

function toBase64(str: string): string {
  return Buffer.from(str).toString("base64");
}

function hmac(payload: string): string {
  return createHmac("sha256", process.env.BETTER_AUTH_SECRET!).update(payload).digest("hex");
}
