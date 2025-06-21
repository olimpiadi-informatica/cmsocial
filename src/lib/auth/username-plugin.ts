import type { Account, AuthPluginSchema, BetterAuthPlugin, User } from "better-auth";
import { createAuthEndpoint, createAuthMiddleware, sendVerificationEmailFn } from "better-auth/api";
import { setSessionCookie } from "better-auth/cookies";
import { APIError } from "better-call";
import { z } from "zod";

const ERROR_CODES = {
  INVALID_USERNAME_OR_PASSWORD: "invalid username or password",
  EMAIL_NOT_VERIFIED: "email not verified",
  UNEXPECTED_ERROR: "unexpected error",
  USERNAME_IS_ALREADY_TAKEN: "username is already taken. please try another.",
  USERNAME_TOO_SHORT: "username is too short",
  USERNAME_TOO_LONG: "username is too long",
  INVALID_USERNAME: "username is invalid",
};

const schema = {
  user: {
    fields: {
      username: {
        type: "string",
        required: false,
        sortable: true,
        unique: true,
        returned: true,
        transform: {
          input(value) {
            return value?.toString().toLowerCase();
          },
        },
      },
      displayUsername: {
        type: "string",
        required: false,
      },
    },
  },
} satisfies AuthPluginSchema;

export type UsernameOptions = {
  minUsernameLength?: number;
  maxUsernameLength?: number;
  usernameValidator?: (username: string) => boolean | Promise<boolean>;
};

function defaultUsernameValidator(username: string) {
  return /^[a-zA-Z0-9_.]+$/.test(username);
}

export const username = (options?: UsernameOptions) => {
  return {
    id: "username",
    endpoints: {
      signInUsername: createAuthEndpoint(
        "/sign-in/username",
        {
          method: "POST",
          body: z.object({
            username: z.string({
              description: "The username of the user",
            }),
            password: z.string({
              description: "The password of the user",
            }),
            rememberMe: z
              .boolean({
                description: "Remember the user session",
              })
              .optional(),
          }),
          metadata: {
            openapi: {
              summary: "Sign in with username",
              description: "Sign in with username",
              responses: {
                200: {
                  description: "Success",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          token: {
                            type: "string",
                            description: "Session token for the authenticated session",
                          },
                          user: {
                            $ref: "#/components/schemas/User",
                          },
                        },
                        required: ["token", "user"],
                      },
                    },
                  },
                },
              },
            },
          },
        },
        async (ctx) => {
          if (!ctx.body.username || !ctx.body.password) {
            ctx.context.logger.error("Username or password not found");
            throw new APIError("UNAUTHORIZED", {
              message: ERROR_CODES.INVALID_USERNAME_OR_PASSWORD,
            });
          }

          const minUsernameLength = options?.minUsernameLength || 3;
          const maxUsernameLength = options?.maxUsernameLength || 30;

          if (ctx.body.username.length < minUsernameLength) {
            ctx.context.logger.error("Username too short", {
              username: ctx.body.username,
            });
            throw new APIError("UNPROCESSABLE_ENTITY", {
              message: ERROR_CODES.USERNAME_TOO_SHORT,
            });
          }

          if (ctx.body.username.length > maxUsernameLength) {
            ctx.context.logger.error("Username too long", {
              username: ctx.body.username,
            });
            throw new APIError("UNPROCESSABLE_ENTITY", {
              message: ERROR_CODES.USERNAME_TOO_LONG,
            });
          }

          const validator = options?.usernameValidator || defaultUsernameValidator;

          if (!validator(ctx.body.username)) {
            throw new APIError("UNPROCESSABLE_ENTITY", {
              message: ERROR_CODES.INVALID_USERNAME,
            });
          }

          const user = await ctx.context.adapter.findOne<User & { username: string }>({
            model: "user",
            where: [
              {
                field: "username",
                value: ctx.body.username,
              },
            ],
          });
          if (!user) {
            // Hash password to prevent timing attacks from revealing valid usernames
            // By hashing passwords for invalid usernames, we ensure consistent response times
            await ctx.context.password.hash(ctx.body.password);
            ctx.context.logger.error("User not found", { username: ctx.body.username });
            throw new APIError("UNAUTHORIZED", {
              message: ERROR_CODES.INVALID_USERNAME_OR_PASSWORD,
            });
          }

          if (
            !user.emailVerified &&
            ctx.context.options.emailAndPassword?.requireEmailVerification
          ) {
            await sendVerificationEmailFn(ctx, user);
            throw new APIError("FORBIDDEN", {
              message: ERROR_CODES.EMAIL_NOT_VERIFIED,
            });
          }

          const account = await ctx.context.adapter.findOne<Account>({
            model: "account",
            where: [
              {
                field: "userId",
                value: user.id,
              },
              {
                field: "providerId",
                value: "credential",
              },
            ],
          });
          if (!account) {
            throw new APIError("UNAUTHORIZED", {
              message: ERROR_CODES.INVALID_USERNAME_OR_PASSWORD,
            });
          }
          const currentPassword = account?.password;
          if (!currentPassword) {
            ctx.context.logger.error("Password not found", { username });
            throw new APIError("UNAUTHORIZED", {
              message: ERROR_CODES.INVALID_USERNAME_OR_PASSWORD,
            });
          }
          const validPassword = await ctx.context.password.verify({
            hash: currentPassword,
            password: ctx.body.password,
          });
          if (!validPassword) {
            ctx.context.logger.error("Invalid password");
            throw new APIError("UNAUTHORIZED", {
              message: ERROR_CODES.INVALID_USERNAME_OR_PASSWORD,
            });
          }
          const session = await ctx.context.internalAdapter.createSession(
            user.id,
            ctx,
            ctx.body.rememberMe === false,
          );
          await setSessionCookie(ctx, { session, user }, ctx.body.rememberMe === false);
          return ctx.json({
            token: session.token,
            user: {
              id: user.id,
              email: user.email,
              emailVerified: user.emailVerified,
              username: user.username,
              name: user.name,
              image: user.image,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
            },
          });
        },
      ),
    },
    schema,
    hooks: {
      before: [
        {
          matcher(context) {
            return context.path === "/sign-up/email" || context.path === "/update-user";
          },
          handler: createAuthMiddleware(async (ctx) => {
            const username = ctx.body.username;
            if (username !== undefined && typeof username === "string") {
              const minUsernameLength = options?.minUsernameLength || 3;
              const maxUsernameLength = options?.maxUsernameLength || 30;
              if (username.length < minUsernameLength) {
                throw new APIError("UNPROCESSABLE_ENTITY", {
                  message: ERROR_CODES.USERNAME_TOO_SHORT,
                });
              }

              if (username.length > maxUsernameLength) {
                throw new APIError("UNPROCESSABLE_ENTITY", {
                  message: ERROR_CODES.USERNAME_TOO_LONG,
                });
              }

              const validator = options?.usernameValidator || defaultUsernameValidator;

              const valid = await validator(username);
              if (!valid) {
                throw new APIError("UNPROCESSABLE_ENTITY", {
                  message: ERROR_CODES.INVALID_USERNAME,
                });
              }
              const user = await ctx.context.adapter.findOne<User>({
                model: "user",
                where: [
                  {
                    field: "username",
                    value: username,
                  },
                ],
              });
              if (user) {
                throw new APIError("UNPROCESSABLE_ENTITY", {
                  message: ERROR_CODES.USERNAME_IS_ALREADY_TAKEN,
                });
              }
            }
          }),
        },
        {
          matcher(context) {
            return context.path === "/sign-up/email" || context.path === "/update-user";
          },
          handler: createAuthMiddleware((ctx) => {
            if (!ctx.body.displayUsername && ctx.body.username) {
              ctx.body.displayUsername = ctx.body.username;
            }
            return Promise.resolve();
          }),
        },
      ],
    },
    $ERROR_CODES: ERROR_CODES,
  } satisfies BetterAuthPlugin;
};
