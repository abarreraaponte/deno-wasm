-- UP MIGRATION
-- This script will be run once to apply the schema.

-- =================================================================
-- 1. Custom Types
-- =================================================================
CREATE TYPE "public"."balance_type" AS ENUM('debit', 'credit');
CREATE TYPE "public"."event_status" AS ENUM('pending', 'processed', 'failed');
CREATE TYPE "public"."module_type" AS ENUM('WASM', 'NATIVE');

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
    "name" varchar(255) NOT NULL UNIQUE
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
-- 3. Flow & Logic Module Tables
-- =================================================================
CREATE TABLE "flows" (
    "id" uuid PRIMARY KEY NOT NULL,
    "name" varchar(255) NOT NULL UNIQUE,
    "triggering_event_type" varchar(255) NOT NULL,
    "active" boolean DEFAULT true
);

CREATE TABLE "flow_steps" (
    "id" uuid PRIMARY KEY NOT NULL,
    "flow_id" uuid NOT NULL,
    "step_order" integer NOT NULL,
    "step_type" varchar(255) NOT NULL,
    "module_type" "module_type",
    "location_uri" text,
    "description" text
);

-- =================================================================
-- 4. Event Store Table
-- =================================================================
CREATE TABLE "events" (
    "id" uuid PRIMARY KEY NOT NULL,
    "correlation_id" uuid NOT NULL,
    "causation_id" uuid,
    "event_type" varchar(255) NOT NULL,
    "payload" jsonb,
    "status" "event_status" DEFAULT 'pending',
    "created_at" timestamptz DEFAULT now(),
    "processing_flow_id" uuid,
    "processing_flow_step_id" uuid
);

-- =================================================================
-- 5. Projection & Application Tables
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
    "transaction_id" uuid NOT NULL,
    "ledger_id" uuid NOT NULL,
    "debit_account_id" uuid NOT NULL,
    "credit_account_id" uuid NOT NULL,
    "unit_id" uuid NOT NULL,
    "value" numeric(64, 16) DEFAULT '0'
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
    "rate" numeric(24, 8) NOT NULL
);

-- =================================================================
-- 6. Foreign Key Constraints
-- =================================================================
ALTER TABLE "units" ADD CONSTRAINT "units_unit_type_id_fk" FOREIGN KEY ("unit_type_id") REFERENCES "public"."unit_types"("id");
ALTER TABLE "flow_steps" ADD CONSTRAINT "flow_steps_flow_id_fk" FOREIGN KEY ("flow_id") REFERENCES "public"."flows"("id");
ALTER TABLE "events" ADD CONSTRAINT "events_causation_id_fk" FOREIGN KEY ("causation_id") REFERENCES "public"."events"("id");
ALTER TABLE "events" ADD CONSTRAINT "events_processing_flow_id_fk" FOREIGN KEY ("processing_flow_id") REFERENCES "public"."flows"("id");
ALTER TABLE "events" ADD CONSTRAINT "events_processing_flow_step_id_fk" FOREIGN KEY ("processing_flow_step_id") REFERENCES "public"."flow_steps"("id");
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
ALTER TABLE "entities" ADD CONSTRAINT "entities_entity_model_id_fk" FOREIGN KEY ("entity_model_id") REFERENCES "public"."entity_models"("id");
ALTER TABLE "entities" ADD CONSTRAINT "entities_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."entities"("id");
ALTER TABLE "dimensions" ADD CONSTRAINT "dimensions_entry_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."entries"("id");
ALTER TABLE "dimensions" ADD CONSTRAINT "dimensions_entity_model_id_fk" FOREIGN KEY ("entity_model_id") REFERENCES "public"."entity_models"("id");
ALTER TABLE "dimensions" ADD CONSTRAINT "dimensions_entity_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id");
ALTER TABLE "conversion_rates" ADD CONSTRAINT "conversion_rates_from_unit_id_fk" FOREIGN KEY ("from_unit_id") REFERENCES "public"."units"("id");
ALTER TABLE "conversion_rates" ADD CONSTRAINT "conversion_rates_to_unit_id_fk" FOREIGN KEY ("to_unit_id") REFERENCES "public"."units"("id");

-- =================================================================
-- 7. Indexes
-- =================================================================
CREATE INDEX "accounts_balance_type_idx" ON "accounts" ("balance_type");
CREATE INDEX "accounts_ref_id_idx" ON "accounts" ("ref_id");
CREATE INDEX "dimensions_entry_id_idx" ON "dimensions" ("entry_id");
CREATE INDEX "dimensions_entity_id_idx" ON "dimensions" ("entity_id");
CREATE INDEX "entities_ref_id_idx" ON "entities" ("ref_id");
CREATE INDEX "entities_name_idx" ON "entities" ("name");
CREATE INDEX "entity_models_ref_id_idx" ON "entity_models" ("ref_id");
CREATE INDEX "entries_debit_account_id_idx" ON "entries" ("debit_account_id");
CREATE INDEX "entries_credit_account_id_idx" ON "entries" ("credit_account_id");
CREATE INDEX "events_correlation_id_idx" ON "events" ("correlation_id");
CREATE INDEX "events_event_type_status_idx" ON "events" ("event_type", "status");
CREATE INDEX "ledgers_ref_id_idx" ON "ledgers" ("ref_id");
CREATE INDEX "transactions_ref_id_idx" ON "transactions" ("ref_id");
CREATE INDEX "units_ref_id_idx" ON "units" ("ref_id");
CREATE INDEX "units_name_idx" ON "units" ("name");

-- Explicit Composite Unique Indexes
CREATE UNIQUE INDEX "transactions_model_id_ref_id_unique_idx" ON "transactions" ("transaction_model_id", "ref_id");
CREATE UNIQUE INDEX "entities_model_id_ref_id_unique_idx" ON "entities" ("entity_model_id", "ref_id");
CREATE UNIQUE INDEX "accounts_ledger_id_name_unique_idx" ON "accounts" ("ledger_id", "name");
CREATE UNIQUE INDEX "flow_steps_flow_id_order_unique_idx" ON "flow_steps" ("flow_id", "step_order");