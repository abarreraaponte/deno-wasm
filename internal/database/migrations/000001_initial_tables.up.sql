-- UP MIGRATION
-- This script will be run once to apply the schema.

-- =================================================================
-- 1. Custom Types and Authentication
-- =================================================================
CREATE TYPE "public"."balance_type" AS ENUM('debit', 'credit');

CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"first_name" varchar(64) NOT NULL UNIQUE,
	"last_name" varchar(64) NOT NULL UNIQUE,
	"email" varchar(255) NOT NULL UNIQUE,
	"password_hash" varchar(255) NOT NULL,
	"created_at" timestamptz DEFAULT now(),
	"updated_at" timestamptz DEFAULT now()
);

-- =================================================================
-- 2. Core Model & Unit Tables
-- =================================================================
CREATE TABLE "entity_models" (
    "id" uuid PRIMARY KEY NOT NULL,
    "ref_id" varchar(64) NOT NULL UNIQUE,
    "alt_id" varchar(64) UNIQUE,
    "name" varchar(255) NOT NULL UNIQUE,
    "active" boolean DEFAULT true
);

CREATE TABLE "transaction_models" (
    "id" uuid PRIMARY KEY NOT NULL,
    "ref_id" varchar(64) NOT NULL UNIQUE,
    "alt_id" varchar(64) UNIQUE,
    "name" varchar(255) NOT NULL UNIQUE,
    "active" boolean DEFAULT true
);

CREATE TABLE "unit_types" (
    "id" uuid PRIMARY KEY NOT NULL,
    "ref_id" varchar(64) NOT NULL UNIQUE,
    "alt_id" varchar(64) UNIQUE,
    "name" varchar(255) NOT NULL UNIQUE,
	"base_unit_id" uuid UNIQUE
);

CREATE TABLE "units" (
    "id" uuid PRIMARY KEY NOT NULL,
    "ref_id" varchar(64) NOT NULL UNIQUE,
    "alt_id" varchar(64) UNIQUE,
    "unit_type_id" uuid NOT NULL,
    "name" varchar(255) NOT NULL UNIQUE,
    "symbol" varchar(20) UNIQUE,
    "precision" integer DEFAULT 0,
    "decimal_separator" char(1) NOT NULL,
    "thousands_separator" char(1) NOT NULL,
    "active" boolean DEFAULT true
);

-- =================================================================
-- 3. Event Store Table
-- =================================================================
CREATE TABLE "events" (
    "id" uuid PRIMARY KEY NOT NULL,
    "parent_id" uuid,
    "event_type" varchar(255) NOT NULL,
    "payload" jsonb,
    "created_at" timestamptz DEFAULT now()
);

-- =================================================================
-- 4. Projection & Application Tables
-- =================================================================
CREATE TABLE "ledgers" (
    "id" uuid PRIMARY KEY NOT NULL,
    "ref_id" varchar(64) NOT NULL UNIQUE,
    "alt_id" varchar(64) UNIQUE,
    "name" varchar(255) NOT NULL UNIQUE,
    "description" text,
    "unit_type_id" uuid,
    "active" boolean DEFAULT true
);

CREATE TABLE "accounts" (
    "id" uuid PRIMARY KEY NOT NULL,
    "ref_id" varchar(64) NOT NULL UNIQUE,
    "alt_id" varchar(64) UNIQUE,
    "balance_type" "balance_type",
    "ledger_id" uuid NOT NULL,
    "parent_id" uuid,
    "name" varchar(255) NOT NULL,
    "meta" jsonb,
    "active" boolean DEFAULT true
);

CREATE TABLE "transactions" (
    "id" uuid PRIMARY KEY NOT NULL,
    "event_id" uuid NOT NULL UNIQUE,
    "transaction_model_id" uuid NOT NULL,
    "ref_id" varchar(64) NOT NULL,
    "alt_id" varchar(64) UNIQUE,
    "meta" jsonb
);

CREATE TABLE "entries" (
    "id" uuid PRIMARY KEY NOT NULL,
	"event_id" uuid NOT NULL,
	"date" date NOT NULL,
    "transaction_id" uuid NOT NULL,
    "ledger_id" uuid NOT NULL,
    "debit_account_id" uuid NOT NULL,
    "credit_account_id" uuid NOT NULL,
    "unit_id" uuid NOT NULL,
    "value" decimal(38, 18) DEFAULT 0
);

CREATE TABLE "entities" (
    "id" uuid PRIMARY KEY NOT NULL,
    "entity_model_id" uuid NOT NULL,
    "parent_id" uuid,
    "ref_id" varchar(64) NOT NULL,
    "alt_id" varchar(64) UNIQUE,
    "name" varchar(255) NOT NULL,
    "meta" jsonb
);

CREATE TABLE "dimensions" (
    "id" uuid PRIMARY KEY NOT NULL,
    "entry_id" uuid NOT NULL,
    "entity_model_id" uuid,
    "entity_id" uuid NOT NULL
);

CREATE TABLE "conversion_rates" (
    "id" uuid PRIMARY KEY NOT NULL,
    "from_unit_id" uuid NOT NULL,
    "to_unit_id" uuid NOT NULL,
    "rate" decimal(38, 18) NOT NULL
);

-- =================================================================
-- 5. Foreign Key Constraints
-- =================================================================
ALTER TABLE "units" ADD CONSTRAINT "units_unit_type_id_fk" FOREIGN KEY ("unit_type_id") REFERENCES "public"."unit_types"("id");
ALTER TABLE "unit_types" ADD CONSTRAINT "unit_types_base_unit_id_fk" FOREIGN KEY ("base_unit_id") REFERENCES "public"."units"("id");
ALTER TABLE "events" ADD CONSTRAINT "events_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id");
ALTER TABLE "ledgers" ADD CONSTRAINT "ledgers_unit_type_id_fk" FOREIGN KEY ("unit_type_id") REFERENCES "public"."unit_types"("id");
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_ledger_id_fk" FOREIGN KEY ("ledger_id") REFERENCES "public"."ledgers"("id");
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."accounts"("id");
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id");
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_transaction_model_id_fk" FOREIGN KEY ("transaction_model_id") REFERENCES "public"."transaction_models"("id");
ALTER TABLE "entries" ADD CONSTRAINT "entries_transaction_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id");
ALTER TABLE "entries" ADD CONSTRAINT "entries_ledger_id_fk" FOREIGN KEY ("ledger_id") REFERENCES "public"."ledgers"("id");
ALTER TABLE "entries" ADD CONSTRAINT "entries_debit_account_id_fk" FOREIGN KEY ("debit_account_id") REFERENCES "public"."accounts"("id");
ALTER TABLE "entries" ADD CONSTRAINT "entries_credit_account_id_fk" FOREIGN KEY ("credit_account_id") REFERENCES "public"."accounts"("id");
ALTER TABLE "entries" ADD CONSTRAINT "entries_unit_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id");
ALTER TABLE "entries" ADD CONSTRAINT "entries_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id");
ALTER TABLE "entities" ADD CONSTRAINT "entities_entity_model_id_fk" FOREIGN KEY ("entity_model_id") REFERENCES "public"."entity_models"("id");
ALTER TABLE "entities" ADD CONSTRAINT "entities_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."entities"("id");
ALTER TABLE "dimensions" ADD CONSTRAINT "dimensions_entry_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."entries"("id");
ALTER TABLE "dimensions" ADD CONSTRAINT "dimensions_entity_model_id_fk" FOREIGN KEY ("entity_model_id") REFERENCES "public"."entity_models"("id");
ALTER TABLE "dimensions" ADD CONSTRAINT "dimensions_entity_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id");
ALTER TABLE "conversion_rates" ADD CONSTRAINT "conversion_rates_from_unit_id_fk" FOREIGN KEY ("from_unit_id") REFERENCES "public"."units"("id");
ALTER TABLE "conversion_rates" ADD CONSTRAINT "conversion_rates_to_unit_id_fk" FOREIGN KEY ("to_unit_id") REFERENCES "public"."units"("id");

-- =================================================================
-- 6. Indexes
-- =================================================================

-- Indexes for Foreign Keys & Common Lookups
CREATE INDEX "accounts_balance_type_idx" ON "accounts" ("balance_type");
CREATE INDEX "accounts_parent_id_idx" ON "accounts" ("parent_id");
CREATE INDEX "entities_parent_id_idx" ON "entities" ("parent_id");
CREATE INDEX "entities_ref_id_idx" ON "entities" ("ref_id");
CREATE INDEX "entities_name_idx" ON "entities" ("name");
CREATE INDEX "entries_event_id_idx" ON "entries" ("event_id");
CREATE INDEX "entries_transaction_id_idx" ON "entries" ("transaction_id");
CREATE INDEX "entries_ledger_id_idx" ON "entries" ("ledger_id");
CREATE INDEX "entries_unit_id_idx" ON "entries" ("unit_id");
CREATE INDEX "events_parent_id_idx" ON "events" ("parent_id");
CREATE INDEX "events_event_type_idx" ON "events" ("event_type");
CREATE INDEX "ledgers_unit_type_id_idx" ON "ledgers" ("unit_type_id");
CREATE INDEX "transactions_transaction_model_id_idx" ON "transactions" ("transaction_model_id");
CREATE INDEX "units_unit_type_id_idx" ON "units" ("unit_type_id");
CREATE INDEX "units_name_idx" ON "units" ("name");

-- Composite Indexes for Performance-Critical Queries
CREATE INDEX "entries_debit_account_id_date_idx" ON "entries" ("debit_account_id", "date");
CREATE INDEX "entries_credit_account_id_date_idx" ON "entries" ("credit_account_id", "date");
CREATE INDEX "dimensions_entry_id_entity_id_idx" ON "dimensions" ("entry_id", "entity_id");

-- Explicit Composite Unique Indexes
CREATE UNIQUE INDEX "transactions_model_id_ref_id_unique_idx" ON "transactions" ("transaction_model_id", "ref_id");
CREATE UNIQUE INDEX "entities_model_id_ref_id_unique_idx" ON "entities" ("entity_model_id", "ref_id");
CREATE UNIQUE INDEX "accounts_ledger_id_name_unique_idx" ON "accounts" ("ledger_id", "name");
CREATE UNIQUE INDEX "conversion_rates_from_to_unique_idx" ON "conversion_rates" ("from_unit_id", "to_unit_id");
