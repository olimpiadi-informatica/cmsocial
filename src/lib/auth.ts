import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, captcha, haveIBeenPwned } from "better-auth/plugins";
import { emailHarmony } from "better-auth-harmony";

import { baseUrlHook } from "~/lib/auth/base-url";

import { passwordHash, passwordVerify } from "./api/crypto";
import { userExtraFields } from "./auth/extra-fields";
import { legacyCookieHook } from "./auth/legacy-cookie";
import { ac, roles } from "./auth/permissions";
import { username } from "./auth/username-plugin";
import { cmsDb } from "./db";
import * as schema from "./db/schema-auth";
import { sendDeleteAccountVerification, sendResetPassword, sendVerificationEmail } from "./email";

export const auth = betterAuth({
  basePath: "/auth",
  database: drizzleAdapter(cmsDb, {
    provider: "pg",
    schema: {
      ...schema,
      users: schema.socialUsers,
    },
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
    password: { hash: passwordHash, verify: passwordVerify },
    sendResetPassword,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail,
  },
  user: {
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification,
    },
    additionalFields: userExtraFields,
  },
  hooks: {
    before: baseUrlHook,
    after: legacyCookieHook,
  },
  plugins: [
    admin({
      ac,
      roles,
      defaultRole: "unverified",
    }),
    captcha({
      provider: "google-recaptcha",
      secretKey: process.env.CAPTCHA_SECRET_KEY!,
      endpoints: ["/sign-up/email", "/forget-password"],
    }),
    emailHarmony(),
    haveIBeenPwned(),
    nextCookies(),
    username({
      minUsernameLength: 3,
      maxUsernameLength: 39,
    }),
  ],
} satisfies BetterAuthOptions);
