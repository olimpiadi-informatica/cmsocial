import { randomUUID } from "node:crypto";

import { cookies } from "next/headers";

import { createAuthMiddleware } from "better-auth/api";
import { SignJWT } from "jose";

import type { User } from "./types";

const JWT_SECRET = new TextEncoder().encode(process.env.BETTER_AUTH_SECRET!);

export const legacyCookieHook = createAuthMiddleware(async (ctx) => {
  const cookieStore = await cookies();

  if (!ctx.context.session && cookieStore.has("training_token")) {
    await setLegacyCookie("", 0);
  }

  if (!ctx.context.newSession) return;
  const { session, user } = ctx.context.newSession;

  const jwt = await createLegacyToken(user as unknown as User, session.expiresAt);
  await setLegacyCookie(jwt, session.expiresAt);
});

export function createLegacyToken(user: User, expirationTime: Date | string) {
  const claims = {
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  return new SignJWT(claims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("https://training.olinfo.it")
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .setJti(randomUUID())
    .sign(JWT_SECRET);
}

async function setLegacyCookie(token: string, expires: Date | number) {
  const cookieStore = await cookies();

  try {
    cookieStore.set("training_token", token, {
      domain: process.env.NODE_ENV === "production" ? "olinfo.it" : undefined,
      secure: process.env.NODE_ENV === "production",
      expires,
      httpOnly: true,
      sameSite: "lax",
    });
  } catch {
    // we are not in a server action
  }
}
