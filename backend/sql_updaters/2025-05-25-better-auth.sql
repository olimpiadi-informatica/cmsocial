BEGIN;

DELETE FROM "users" WHERE "email" IS NULL;

DROP TRIGGER user_insert ON "users";

CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);

CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);

CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);

ALTER TABLE "social_users" RENAME COLUMN "registration_time" TO "created_at";
ALTER TABLE "social_users" ADD COLUMN "auth_id" text;
ALTER TABLE "social_users" ADD COLUMN "first_name" text;
ALTER TABLE "social_users" ADD COLUMN "last_name" text;
ALTER TABLE "social_users" ADD COLUMN "name" text;
ALTER TABLE "social_users" ADD COLUMN "username" text;
ALTER TABLE "social_users" ADD COLUMN "display_username" text;
ALTER TABLE "social_users" ADD COLUMN "email" text;
ALTER TABLE "social_users" ADD COLUMN "email_verified" boolean;
ALTER TABLE "social_users" ADD COLUMN "normalized_email" text;
ALTER TABLE "social_users" ADD COLUMN "image" text GENERATED ALWAYS AS ('https://www.gravatar.com/avatar/' || MD5("social_users"."email") || '?d=identicon') STORED;
ALTER TABLE "social_users" ADD COLUMN "role" text DEFAULT 'newbie';
ALTER TABLE "social_users" ADD COLUMN "banned" boolean;
ALTER TABLE "social_users" ADD COLUMN "ban_reason" text;
ALTER TABLE "social_users" ADD COLUMN "ban_expires" timestamp;
ALTER TABLE "social_users" ADD COLUMN "updated_at" timestamp;

UPDATE "social_users" SET "auth_id" = "id";
UPDATE "social_users" SET "first_name" = "users"."first_name" FROM "users" WHERE "social_users"."id" = "users"."id";
UPDATE "social_users" SET "last_name" = "users"."last_name" FROM "users" WHERE "social_users"."id" = "users"."id";
UPDATE "social_users" SET "username" = "users"."username" FROM "users" WHERE "social_users"."id" = "users"."id";
UPDATE "social_users" SET "email" = "users"."email" FROM "users" WHERE "social_users"."id" = "users"."id";
UPDATE "social_users" SET "name" = "first_name" || ' ' || "last_name";
UPDATE "social_users" SET "email_verified" = true;
UPDATE "social_users" SET "normalized_email" = "email";
UPDATE "social_users" SET "role" = 'trusted' FROM "social_participations"
                      INNER JOIN "participations" ON "participations"."id" = "social_participations"."id"
                      WHERE "social_users"."id" = "participations"."user_id" AND "social_participations"."score" >= 10000;
UPDATE "social_users" SET "role" = 'admin' WHERE "access_level" = 0;
UPDATE "social_users" SET "updated_at" = "_updated";

ALTER TABLE "social_users" ALTER COLUMN "auth_id" SET NOT NULL;
ALTER TABLE "social_users" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "social_users" ALTER COLUMN "first_name" SET NOT NULL;
ALTER TABLE "social_users" ALTER COLUMN "last_name" SET NOT NULL;
ALTER TABLE "social_users" ALTER COLUMN "username" SET NOT NULL;
ALTER TABLE "social_users" ALTER COLUMN "email" SET NOT NULL;
ALTER TABLE "social_users" ALTER COLUMN "email_verified" SET NOT NULL;
ALTER TABLE "social_users" ALTER COLUMN "normalized_email" SET NOT NULL;
ALTER TABLE "social_users" ALTER COLUMN "image" SET NOT NULL;
ALTER TABLE "social_users" ALTER COLUMN "role" SET NOT NULL;
ALTER TABLE "social_users" ALTER COLUMN "updated_at" SET NOT NULL;
ALTER TABLE "social_users" ALTER COLUMN "access_level" SET DEFAULT 6;

ALTER TABLE "task_tags" DROP CONSTRAINT "task_tags_participation_id_fkey";
ALTER TABLE "social_users" DROP CONSTRAINT "social_users_pkey";

ALTER TABLE "social_users" ADD CONSTRAINT "social_users_auth_id_pk" PRIMARY KEY ("auth_id");
ALTER TABLE "social_users" ADD CONSTRAINT "social_users_id_unique" UNIQUE ("id");
ALTER TABLE "social_users" ADD CONSTRAINT "social_users_username_unique" UNIQUE("username");
ALTER TABLE "social_users" ADD CONSTRAINT "social_users_email_unique" UNIQUE("email");
ALTER TABLE "social_users" ADD CONSTRAINT "social_users_normalized_email_unique" UNIQUE("normalized_email");

ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_social_users_auth_id_fk" FOREIGN KEY ("user_id") REFERENCES "social_users"("auth_id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_social_users_auth_id_fk" FOREIGN KEY ("user_id") REFERENCES "social_users"("auth_id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "task_tags" ADD CONSTRAINT "task_tags_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "social_users"("id");

INSERT INTO "accounts" ("id", "account_id", "provider_id", "user_id", "password", "created_at", "updated_at")
SELECT "social_users"."id", "social_users"."id", 'credential', "social_users"."id", "users"."password", "social_users"."created_at", "social_users"."updated_at"
FROM "social_users" INNER JOIN "users" ON "social_users"."id" = "users"."id";

CREATE FUNCTION set_trusted_role()
  RETURNS trigger
  LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE social_users su
    SET role = 'trusted'
    FROM participations p
    WHERE p.id = NEW.id AND p.user_id = su.id AND su.role = 'newbie';
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_trusted_role_trigger
  AFTER UPDATE OF score ON social_participations
  FOR EACH ROW WHEN (NEW.score >= 10000)
  EXECUTE FUNCTION set_trusted_role();

ROLLBACK;
