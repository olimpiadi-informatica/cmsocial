import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const socialUsers = pgTable("social_users", {
  id: integer().primaryKey(),
  accessLevel: integer("access_level").notNull(),
  registrationTime: timestamp("registration_time").notNull(),
  instituteId: integer("institute_id"),
  instituteCode: varchar("institute_code"),
  recoverCode: varchar("recover_code"),
  lastRecover: timestamp("last_recover").default(new Date(0)).notNull(),
});

export const socialContests = pgTable("social_contests", {
  id: integer().primaryKey(),
  accessLevel: integer("access_level").notNull(),
  socialEnabled: boolean("social_enabled").notNull(),
  forum: varchar(),
  topLeftName: varchar("top_left_name").notNull(),
  title: varchar().notNull(),
  mailServer: varchar("mail_server"),
  mailUsername: varchar("mail_username"),
  mailPassword: varchar("mail_password"),
  mailFrom: varchar("mail_from"),
  recaptchaPublicKey: varchar("recaptcha_public_key"),
  recaptchaSecretKey: varchar("recaptcha_secret_key"),
  analytics: varchar(),
  cookieDomain: varchar("cookie_domain"),
  homepage: varchar(),
  menu: varchar(),
});

export const socialParticipations = pgTable("social_participations", {
  id: integer().primaryKey(),
  accessLevel: integer("access_level"),
  score: integer().notNull(),
  lastHelpTime: timestamp("last_help_time").notNull(),
  helpCount: integer("help_count").notNull(),
});

export const socialTasks = pgTable("social_tasks", {
  id: integer().primaryKey(),
  accessLevel: integer("access_level").notNull(),
  subCount: integer("nsubs").notNull(),
  correctSubCount: integer("nsubscorrect").notNull(),
  userCount: integer("nusers").notNull(),
  correctUserCount: integer("nuserscorrect").notNull(),
  helpAvailable: boolean("help_available").default(false).notNull(),
  scoreMultiplier: doublePrecision("score_multiplier").default(1).notNull(),
  evaluationMetadata: text("evaluationmetadata"),
  difficulty: integer(),
  category: varchar(),
});

export const tags = pgTable("tags", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  hidden: boolean(),
  description: varchar().notNull(),
  isTechnique: boolean("is_technique").notNull(),
  isEvent: boolean("is_event").notNull(),
});

export const taskTags = pgTable("task_tags", {
  taskId: integer("task_id").notNull(),
  tagId: integer("tag_id").notNull(),
  addedBy: integer("user_id"),
  approved: boolean().default(false),
});

export const taskScores = pgTable("taskscores", {
  id: serial().primaryKey(),
  taskId: integer("task_id").notNull(),
  score: integer().notNull(),
  time: doublePrecision().notNull(),
  participationId: integer("participation_id").notNull(),
});
