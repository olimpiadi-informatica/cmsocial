BEGIN;

ALTER TABLE
  social_users DROP COLUMN institute_id;

DROP TABLE institutes;

DROP TABLE cities;

DROP TABLE provinces;

DROP TABLE regions;

ALTER TABLE
  social_users
ADD
  COLUMN institute_id VARCHAR;

CREATE INDEX ON social_users (institute_id);

ROLLBACK;
