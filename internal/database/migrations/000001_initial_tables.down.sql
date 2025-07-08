-- DOWN MIGRATION
-- This script will drop all tables and types created in the up migration.

-- Drop tables in reverse order due to foreign key constraints
DROP TABLE IF EXISTS "conversion_rates";
DROP TABLE IF EXISTS "dimensions";
DROP TABLE IF EXISTS "entities";
DROP TABLE IF EXISTS "entries";
DROP TABLE IF EXISTS "transactions";
DROP TABLE IF EXISTS "accounts";
DROP TABLE IF EXISTS "ledgers";
DROP TABLE IF EXISTS "events";
DROP TABLE IF EXISTS "units";
DROP TABLE IF EXISTS "unit_types";
DROP TABLE IF EXISTS "transaction_models";
DROP TABLE IF EXISTS "entity_models";
DROP TABLE IF EXISTS "users";

-- Drop custom types
DROP TYPE IF EXISTS "public"."balance_type";
