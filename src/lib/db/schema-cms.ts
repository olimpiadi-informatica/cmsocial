import {
  bigint,
  boolean,
  customType,
  doublePrecision,
  integer,
  interval,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const cidrArray = customType<{ data: string[] }>({
  dataType() {
    return "cidr[]";
  },
});

export const compilationOutcome = pgEnum("compilation_outcome", ["ok", "fail"]);
export const evaluationOutcome = pgEnum("evaluation_outcome", ["ok"]);
export const feedbackLevel = pgEnum("feedback_level", ["full", "restricted", "oi_restricted"]);
export const scoreMode = pgEnum("score_mode", ["max", "max_subtask", "max_tokened_last"]);
export const tokenMode = pgEnum("token_mode", ["disabled", "finite", "infinite"]);

export const attachments = pgTable("attachments", {
  id: serial().primaryKey(),
  taskId: integer("task_id").notNull(),
  filename: varchar().notNull(),
  digest: varchar().notNull(),
});

export type TaskType = "Batch" | "Communication" | "OutputOnly";
export type BatchParameters = ["grader" | "alone", ["" | "input.txt", "" | "output.txt"]];
export type CommunicationParameters = [number, "stub" | "alone", "std_io" | "fifo"];
export type OutputOnlyParameters = ["comparator"];

export const datasets = pgTable("datasets", {
  id: serial().primaryKey(),
  taskId: integer("task_id").notNull(),
  description: varchar().notNull(),
  autojudge: boolean().notNull(),
  timeLimit: doublePrecision("time_limit"),
  memoryLimit: bigint("memory_limit", { mode: "bigint" }),
  taskType: varchar("task_type").$type<TaskType>().notNull(),
  taskTypeParameters: jsonb("task_type_parameters")
    .$type<BatchParameters | CommunicationParameters | OutputOnlyParameters>()
    .notNull(),
  scoreType: varchar("score_type").notNull(),
  scoreTypeParameters: jsonb("score_type_parameters").notNull(),
});

export const evaluations = pgTable("evaluations", {
  id: serial().primaryKey(),
  submissionId: integer("submission_id").notNull(),
  datasetId: integer("dataset_id").notNull(),
  testcaseId: integer("testcase_id").notNull(),
  outcome: varchar(),
  executionTime: doublePrecision("execution_time"),
  executionWallClockTime: doublePrecision("execution_wall_clock_time"),
  executionMemory: bigint("execution_memory", { mode: "bigint" }),
  evaluationShard: integer("evaluation_shard"),
  evaluationSandboxPaths: varchar("evaluation_sandbox_paths").array(),
  evaluationSandboxDigests: varchar("evaluation_sandbox_digests").array(),
  text: varchar().array().notNull(),
  adminText: varchar("admin_text"),
});

export const files = pgTable("files", {
  id: serial().primaryKey(),
  submissionId: integer("submission_id").notNull(),
  filename: varchar().notNull(),
  digest: varchar().notNull(),
});

export const groups = pgTable("groups", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  start: timestamp().notNull(),
  stop: timestamp().notNull(),
  analysisEnabled: boolean("analysis_enabled").notNull(),
  analysisStart: timestamp("analysis_start").notNull(),
  analysisStop: timestamp("analysis_stop").notNull(),
  perUserTime: interval("per_user_time"),
  contestId: integer("contest_id").notNull(),
});

export const contests = pgTable("contests", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  description: varchar().notNull(),
  allowedLocalizations: varchar("allowed_localizations").array().default([""]).notNull(),
  languages: varchar().array().notNull(),
  submissionsDownloadAllowed: boolean("submissions_download_allowed").default(true).notNull(),
  allowQuestions: boolean("allow_questions").default(true).notNull(),
  allowUserTests: boolean("allow_user_tests").default(true).notNull(),
  allowUnofficialSubmissionBeforeAnalysisMode: boolean(
    "allow_unofficial_submission_before_analysis_mode",
  )
    .default(false)
    .notNull(),
  blockHiddenParticipations: boolean("block_hidden_participations").default(false).notNull(),
  allowPasswordAuthentication: boolean("allow_password_authentication").default(true).notNull(),
  allowRegistration: boolean("allow_registration").default(false).notNull(),
  ipRestriction: boolean("ip_restriction").default(false).notNull(),
  ipAutologin: boolean("ip_autologin").default(false).notNull(),
  tokenMode: tokenMode("token_mode").notNull(),
  tokenMaxNumber: integer("token_max_number"),
  tokenMinInterval: interval("token_min_interval").notNull(),
  tokenGenInitial: integer("token_gen_initial").notNull(),
  tokenGenNumber: integer("token_gen_number").notNull(),
  tokenGenInterval: interval("token_gen_interval").notNull(),
  tokenGenMax: integer("token_gen_max"),
  timezone: varchar(),
  maxSubmissionNumber: integer("max_submission_number"),
  maxUserTestNumber: integer("max_user_test_number"),
  minSubmissionInterval: interval("min_submission_interval"),
  minSubmissionIntervalGracePeriod: interval("min_submission_interval_grace_period"),
  minUserTestInterval: interval("min_user_test_interval"),
  scorePrecision: integer("score_precision").notNull(),
  mainGroupId: integer("main_group_id"),
});

export const managers = pgTable("managers", {
  id: serial().primaryKey(),
  datasetId: integer("dataset_id").notNull(),
  filename: varchar().notNull(),
  digest: varchar().notNull(),
});

export const participations = pgTable("participations", {
  id: serial().primaryKey(),
  ip: cidrArray("ip"),
  startingTime: timestamp("starting_time"),
  delayTime: interval("delay_time").default("00:00:00").notNull(),
  extraTime: interval("extra_time").default("00:00:00").notNull(),
  password: varchar(),
  hidden: boolean().default(false).notNull(),
  unrestricted: boolean().default(false).notNull(),
  contestId: integer("contest_id").notNull(),
  userId: integer("user_id").notNull(),
  groupId: integer("group_id").notNull(),
  teamId: integer("team_id"),
});

export const users = pgTable("users", {
  id: serial().primaryKey(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  username: varchar().notNull(),
  password: varchar().notNull(),
  email: varchar(),
  timezone: varchar(),
  preferredLanguages: varchar("preferred_languages").array().default([""]).notNull(),
});

export const submissions = pgTable("submissions", {
  id: serial().primaryKey(),
  opaqueId: bigint("opaque_id", { mode: "bigint" }).notNull(),
  participationId: integer("participation_id").notNull(),
  taskId: integer("task_id").notNull(),
  timestamp: timestamp().notNull(),
  language: varchar(),
  comment: varchar().default("").notNull(),
  official: boolean().default(true).notNull(),
  overrideTimeLimit: doublePrecision("override_time_limit"),
  overrideMemLimit: bigint("override_mem_limit", { mode: "bigint" }),
});

export const tasks = pgTable("tasks", {
  id: serial().primaryKey(),
  num: integer(),
  contestId: integer("contest_id"),
  name: varchar().notNull(),
  title: varchar().notNull(),
  submissionFormat: varchar("submission_format").array().default([""]).notNull(),
  primaryStatements: varchar("primary_statements").array().notNull(),
  allowedLanguages: varchar("allowed_languages").array(),
  tokenMode: tokenMode("token_mode").notNull(),
  tokenMaxNumber: integer("token_max_number"),
  tokenMinInterval: interval("token_min_interval").notNull(),
  tokenGenInitial: integer("token_gen_initial").notNull(),
  tokenGenNumber: integer("token_gen_number").notNull(),
  tokenGenInterval: interval("token_gen_interval").notNull(),
  tokenGenMax: integer("token_gen_max"),
  maxSubmissionNumber: integer("max_submission_number"),
  maxUserTestNumber: integer("max_user_test_number"),
  minSubmissionInterval: interval("min_submission_interval"),
  minUserTestInterval: interval("min_user_test_interval"),
  feedbackLevel: feedbackLevel("feedback_level").default("full").notNull(),
  scorePrecision: integer("score_precision").notNull(),
  scoreMode: scoreMode("score_mode").default("max_tokened_last").notNull(),
  activeDatasetId: integer("active_dataset_id"),
});

export const testcases = pgTable("testcases", {
  id: serial().primaryKey(),
  datasetId: integer("dataset_id").notNull(),
  codename: varchar().notNull(),
  public: boolean().notNull(),
  input: varchar().notNull(),
  output: varchar().notNull(),
});

export const statements = pgTable("statements", {
  id: serial().primaryKey(),
  taskId: integer("task_id").notNull(),
  language: varchar().notNull(),
  digest: varchar().notNull(),
});

export type RawSubmissionResultTestcase = {
  idx: string;
  outcome: "Correct" | "Partially correct" | "Not correct";
  memory: number | null;
  time: number | null;
  text: [string, ...unknown[]];
};

export type RawSubmissionResultSubtask = {
  idx: number;
  testcases: RawSubmissionResultTestcase[];
  max_score: number;
} & (
  | {
      score?: never;
      score_fraction: number;
    }
  | {
      score: number;
      score_fraction?: never;
    }
);

export const submissionResults = pgTable("submission_results", {
  submissionId: integer("submission_id").notNull(),
  datasetId: integer("dataset_id").notNull(),
  compilationOutcome: compilationOutcome("compilation_outcome"),
  compilationTries: integer("compilation_tries").notNull(),
  compilationStdout: varchar("compilation_stdout"),
  compilationStderr: varchar("compilation_stderr"),
  compilationTime: doublePrecision("compilation_time"),
  compilationWallClockTime: doublePrecision("compilation_wall_clock_time"),
  compilationMemory: bigint("compilation_memory", { mode: "bigint" }),
  compilationShard: integer("compilation_shard"),
  compilationSandboxPaths: varchar("compilation_sandbox_paths").array(),
  compilationSandboxDigests: varchar("compilation_sandbox_digests").array(),
  evaluationOutcome: evaluationOutcome("evaluation_outcome"),
  evaluationTries: integer("evaluation_tries").notNull(),
  score: doublePrecision(),
  scoreDetails: jsonb("score_details").$type<
    RawSubmissionResultSubtask[] | RawSubmissionResultTestcase[]
  >(),
  scoredAt: timestamp("scored_at"),
  publicScore: doublePrecision("public_score"),
  publicScoreDetails: jsonb("public_score_details"),
  compilationText: varchar("compilation_text").array().notNull(),
  rankingScoreDetails: varchar("ranking_score_details").array(),
});
