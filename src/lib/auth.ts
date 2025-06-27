import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, captcha, haveIBeenPwned } from "better-auth/plugins";
import { emailHarmony } from "better-auth-harmony";

import { passwordHash, passwordVerify } from "./api/crypto";
import { createParticipation, createUser, deleteUser } from "./api/registration";
import { userExtraFields } from "./auth/extra-fields";
import { legacyCookieHook } from "./auth/legacy-cookie";
import { ac, roles } from "./auth/permissions";
import type { User } from "./auth/types";
import { username } from "./auth/username-plugin";
import { cmsDb } from "./db";
import * as schema from "./db/schema-auth";
import {
  sendChangeEmailVerification,
  sendDeleteAccountVerification,
  sendResetPassword,
  sendVerificationEmail,
} from "./email";
import { forumDeleteUser } from "./forum/admin";

export const auth = betterAuth({
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
    requireEmailVerification: true,
    sendResetPassword,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail,
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification,
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification,
      afterDelete: async (user) => {
        await deleteUser(user.email);
        await forumDeleteUser((user as unknown as User).username);
      },
    },
    additionalFields: userExtraFields,
  },
  hooks: {
    after: legacyCookieHook,
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          (user as unknown as User).cmsId = await createUser(user as unknown as User);
        },
        after: async (user) => {
          await createParticipation(user as unknown as User);
        },
      },
    },
  },
  plugins: [
    admin({ ac, roles }),
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
