import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, captcha, genericOAuth, haveIBeenPwned, username } from "better-auth/plugins";
import { emailHarmony } from "better-auth-harmony";

import { baseUrlHook } from "~/lib/auth/base-url";

import { passwordHash, passwordVerify } from "./api/crypto";
import { userExtraFields } from "./auth/extra-fields";
import { legacyCookieHook } from "./auth/legacy-cookie";
import { ac, roles } from "./auth/permissions";
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
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      allowDifferentEmails: true,
    },
  },
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
    genericOAuth({
      config: [
        {
          providerId: "olimanager",
          clientId: process.env.OLIMANAGER_CLIENT_ID!,
          clientSecret: process.env.OLIMANAGER_CLIENT_SECRET!,
          discoveryUrl: "https://olimpiadi-scientifiche.it/o/.well-known/openid-configuration",
          scopes: ["openid", "profile", "email"],
          pkce: true,
        },
      ],
    }),
    haveIBeenPwned(),
    nextCookies(),
    username({
      minUsernameLength: 3,
      maxUsernameLength: 39,
      usernameNormalization: false,
    }),
  ],
} satisfies BetterAuthOptions);
