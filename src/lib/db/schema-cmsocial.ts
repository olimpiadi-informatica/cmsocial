import {
  boolean,
  date,
  doublePrecision,
  integer,
  jsonb,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";

export const socialParticipations = pgTable("social_participations", {
  id: integer().primaryKey(),
  score: integer().notNull(),
});

export const socialTasks = pgTable("social_tasks", {
  id: integer().primaryKey(),
  subCount: integer("nsubs").notNull(),
  correctSubCount: integer("nsubscorrect").notNull(),
  userCount: integer("nusers").notNull(),
  correctUserCount: integer("nuserscorrect").notNull(),
  scoreMultiplier: doublePrecision("score_multiplier").default(1).notNull(),
  createdAt: date("_created", { mode: "date" }).notNull(),
});

export const tags = pgTable("tags", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  translations: jsonb("translations").$type<Record<string, string>>().notNull(),
  isTechnique: boolean("is_technique").notNull(),
  isEvent: boolean("is_event").notNull(),
});

export const taskTags = pgTable("task_tags", {
  taskId: integer("task_id").notNull(),
  tagId: integer("tag_id").notNull(),
  addedBy: integer("user_id"),
});

export const taskScores = pgTable("taskscores", {
  id: serial().primaryKey(),
  taskId: integer("task_id").notNull(),
  score: integer().notNull(),
  time: doublePrecision().notNull(),
  participationId: integer("participation_id").notNull(),
});
