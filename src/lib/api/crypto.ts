import { verify as verifyBcrypt } from "@node-rs/bcrypt";

import { hashPassword as hashScrypt, verifyPassword as verifyScript } from "better-auth/crypto";

export async function passwordHash(password: string): Promise<string> {
  const hash = await hashScrypt(password);
  return `scrypt:${hash}`;
}

export async function passwordVerify({
  hash,
  password,
}: { hash: string; password: string }): Promise<boolean> {
  if (hash.startsWith("bcrypt:")) {
    return await verifyBcrypt(password, hash.replace(/^bcrypt:/, ""));
  }
  if (hash.startsWith("scrypt:")) {
    return await verifyScript({ password, hash: hash.replace(/^scrypt:/, "") });
  }
  return false;
}
