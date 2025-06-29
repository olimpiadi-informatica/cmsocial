BEGIN;

ALTER TABLE "social_users" ADD COLUMN "registration_step" int DEFAULT 5;
ALTER TABLE "social_users" ALTER COLUMN "registration_step" SET NOT NULL;
ALTER TABLE "social_users" ALTER COLUMN "registration_step" SET DEFAULT 3;

ALTER TABLE "social_users" ALTER COLUMN "id" DROP NOT NULL;
ALTER TABLE "social_users" ALTER COLUMN "username" DROP NOT NULL;

ALTER TABLE "social_users" DROP COLUMN "first_name";
ALTER TABLE "social_users" DROP COLUMN "last_name";

ROLLBACK;
