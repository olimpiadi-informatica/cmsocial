import {
  boolean,
  date,
  doublePrecision,
  integer,
  jsonb,
  pgEnum,
  pgMaterializedView,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
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

export const quizmsSession = pgTable("quizms_session", {
  userId: text("user_id").notNull(),
  quizmsContestId: text("quizms_contest_id").notNull(),
  quizmsVariantId: text("quizms_variant_id"),
  answers: jsonb("answers").$type<Record<string, any>>(),
  score: integer(),
  maxScore: integer("max_score"),
  startedAt: timestamp("started_at"),
  finishedAt: timestamp("finished_at"),
});

export const userMonthlyRanks = pgMaterializedView("user_monthly_ranks", {
  userId: integer("user_id").notNull(),
  month: date("month", { mode: "date" }).notNull(),
  score: integer("score").notNull(),
  rank: integer("rank").notNull(),
}).existing();

export const editorialType = pgEnum("editorial_type", ["markdown", "pdf_file"]);

export const editorials = pgTable("editorials", {
  id: serial().primaryKey(),
  type: editorialType("type").notNull(),
  title: varchar("title", { length: 255 }),
  content: text("content"),
  digest: varchar("digest", { length: 64 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const taskEditorials = pgTable(
  "task_editorials",
  {
    id: serial().primaryKey(),
    editorialId: integer("editorial_id")
      .notNull()
      .references(() => editorials.id, { onDelete: "cascade" }),
    taskName: varchar("task_name", { length: 128 }).notNull(),
    isTerry: boolean("is_terry").default(false).notNull(),
    page: integer("page"),
  },
  (table) => [
    uniqueIndex("task_editorials_task_name_is_terry_editorial_id_idx").on(
      table.taskName,
      table.isTerry,
      table.editorialId,
    ),
  ],
);
