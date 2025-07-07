-- DOWN MIGRATION
-- This script will be run to undo the schema changes.
-- We drop everything in reverse order of creation. Using CASCADE simplifies this process.

DROP TABLE IF EXISTS "conversion_rates" CASCADE;
DROP TABLE IF EXISTS "dimensions" CASCADE;
DROP TABLE IF EXISTS "entities" CASCADE;
DROP TABLE IF EXISTS "entries" CASCADE;
DROP TABLE IF EXISTS "transactions" CASCADE;
DROP TABLE IF EXISTS "accounts" CASCADE;
DROP TABLE IF EXISTS "ledgers" CASCADE;
DROP TABLE IF EXISTS "units" CASCADE;
DROP TABLE IF EXISTS "unit_types" CASCADE;
DROP TABLE IF EXISTS "transaction_models" CASCADE;
DROP TABLE IF EXISTS "entity_models" CASCADE;
DROP TABLE IF EXISTS "events" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

DROP TYPE IF EXISTS "public"."balance_type";