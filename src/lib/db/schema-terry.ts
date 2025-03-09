import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const terryMetadata = sqliteTable("metadata", {
  key: text().primaryKey(),
  value: text(),
});

export const terryUsers = sqliteTable("users", {
  token: text().primaryKey(),
  name: text().notNull(),
  surname: text().notNull(),
  extraTime: integer("extra_time").default(0).notNull(),
  ssoUser: integer("sso_user").default(0),
  contestStartDelay: integer("contest_start_delay"),
});

export const terryTasks = sqliteTable("tasks", {
  name: text().primaryKey(),
  title: text().notNull(),
  statementPath: text("statement_path").notNull(),
  maxScore: real("max_score").notNull(),
  num: integer().notNull(),
  submissionTimeout: integer("submission_timeout"),
});

export const terryIps = sqliteTable("ips", {
  token: text().notNull(),
  ip: text().notNull(),
  firstDate: integer("first_date").notNull(),
});

export const terryAdminIps = sqliteTable("admin_ips", {
  ip: text().primaryKey(),
  firstDate: integer("first_date").notNull(),
});

export const terryInputs = sqliteTable("inputs", {
  id: text().primaryKey(),
  token: text().notNull(),
  task: text().notNull(),
  attempt: integer().notNull(),
  date: integer().notNull(),
  path: text().notNull(),
  size: integer().notNull(),
});

export const terrySources = sqliteTable("sources", {
  id: text().primaryKey(),
  input: text().notNull(),
  date: integer().notNull(),
  path: text().notNull(),
  size: integer().notNull(),
});

export const terryOutputs = sqliteTable("outputs", {
  id: text().primaryKey(),
  input: text().notNull(),
  date: integer().notNull(),
  path: text().notNull(),
  size: integer().notNull(),
  result: text().notNull(),
});

export const terrySubmissions = sqliteTable("submissions", {
  id: text().primaryKey(),
  token: text().notNull(),
  task: text().notNull(),
  input: text().notNull(),
  output: text().notNull(),
  source: text().notNull(),
  score: real().notNull(),
  date: integer().notNull(),
});

export const terryUserTasks = sqliteTable("user_tasks", {
  token: text().notNull(),
  task: text().notNull(),
  score: real().notNull(),
  currentAttempt: integer("current_attempt"),
});
