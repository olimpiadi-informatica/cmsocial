import { msg } from "@lingui/core/macro";
import { SignJWT } from "jose";
import { getSessionUser } from "~/lib/user";

const JWT_SECRET = new TextEncoder().encode(process.env.AUTH_SECRET!);

export async function getCookie() {
  const user = await getSessionUser();
  if (!user) throw msg`Utente non trovato`;

  const claims = {
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
  };
  const jwt = await new SignJWT(claims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5mins")
    .sign(JWT_SECRET);
  return `training_token=${jwt}`;
}
