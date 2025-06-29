import { randomUUID } from "node:crypto";

import { cookies } from "next/headers";

import { createAuthMiddleware } from "better-auth/api";
import { SignJWT } from "jose";

import { RegistrationStep, type User } from "./types";

const JWT_SECRET = new TextEncoder().encode(process.env.BETTER_AUTH_SECRET!);

export const legacyCookieHook = createAuthMiddleware(async (ctx) => {
  if (ctx.path === "/sign-out") {
    await removeLegacyCookie();
  }

  if (ctx.path === "/update-user" && ctx.context.session && ctx.body.cmsId) {
    const { session, user } = ctx.context.session;
    await setLegacyCookie(user as unknown as User, session.expiresAt);
  }

  if (ctx.context.newSession) {
    const { session, user } = ctx.context.newSession;
    if (user.registrationStep === RegistrationStep.Completed) {
      await setLegacyCookie(user as unknown as User, session.expiresAt);
    }
  }
});

async function setLegacyCookie(user: User, expiresAt: Date) {
  const jwt = await createLegacyToken(user, expiresAt);
  await sendLegacyCookie(jwt, expiresAt);
}

async function removeLegacyCookie() {
  await sendLegacyCookie("", 0);
}

export function createLegacyToken(user: User, expirationTime: Date | string) {
  const claims = { username: user.username };

  return new SignJWT(claims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("https://training.olinfo.it")
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .setJti(randomUUID())
    .sign(JWT_SECRET);
}

async function sendLegacyCookie(token: string, expires: Date | number) {
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
