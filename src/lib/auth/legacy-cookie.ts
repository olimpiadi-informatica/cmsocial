import { randomUUID } from "node:crypto";

import { cookies } from "next/headers";

import { createAuthMiddleware } from "better-auth/api";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.BETTER_AUTH_SECRET!);

export const legacyCookieHook = createAuthMiddleware(async (ctx) => {
  const cookieStore = await cookies();

  if (!ctx.context.session && cookieStore.has("training_token")) {
    await setLegacyCookie("", { maxAge: 0 });
  }

  if (!ctx.context.newSession) return;
  const { session, user } = ctx.context.newSession;

  const claims = {
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
  };
  const jwt = await new SignJWT(claims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("https://training.olinfo.it")
    .setSubject(user.id)
    .setAudience(["https://training.olinfo.it", "https://territoriali.olinfo.it"])
    .setIssuedAt()
    .setNotBefore(session.createdAt)
    .setExpirationTime(session.expiresAt)
    .setJti(randomUUID())
    .sign(JWT_SECRET);

  await setLegacyCookie(jwt, {
    domain: process.env.NODE_ENV === "production" ? "olinfo.it" : undefined,
    secure: process.env.NODE_ENV === "production",
    expires: session.expiresAt,
    httpOnly: true,
    sameSite: "lax",
  });
});

type CookieOptions = Parameters<Awaited<ReturnType<typeof cookies>>["set"]>[2];

async function setLegacyCookie(token: string, options: CookieOptions) {
  const cookieStore = await cookies();

  try {
    cookieStore.set("training_token", token, options);
  } catch {
    // we are not in a server action
  }
}
