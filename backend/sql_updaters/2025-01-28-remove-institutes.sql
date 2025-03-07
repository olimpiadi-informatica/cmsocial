BEGIN;

ALTER TABLE
  social_users
ADD
  COLUMN institute_code VARCHAR;

CREATE INDEX ON social_users (institute_code);

ROLLBACK;
