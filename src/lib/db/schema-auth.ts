import { type SQL, sql } from "drizzle-orm";
import { boolean, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const socialUsers = pgTable("social_users", {
  id: text("auth_id").primaryKey(),
  cmsId: integer("id").notNull(),
  name: text("name").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  username: text("username").unique(),
  displayUsername: text("display_username"),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  normalizedEmail: text("normalized_email").unique(),
  image: text("image")
    .notNull()
    .generatedAlwaysAs(
      (): SQL =>
        sql`'https://www.gravatar.com/avatar/' || MD5(${socialUsers.email}) || '?d=identicon'`,
    ),
  institute: varchar("institute_code"),
  role: text("role").$type<"newbie" | "trusted" | "admin">(),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  createdAt: timestamp("registration_time").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => socialUsers.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => socialUsers.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
