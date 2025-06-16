-- UP MIGRATION
-- This script will be run once to apply the schema.

-- First, create custom types
CREATE TYPE "public"."balance_type" AS ENUM('debit', 'credit');

-- Create all tables. We define foreign keys later to avoid dependency issues.
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
	"name" varchar(255) NOT NULL UNIQUE,
	"meta" jsonb,
	"active" boolean DEFAULT true
);

CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ref_id" varchar(64) NOT NULL UNIQUE,
	"alt_id" varchar(64) UNIQUE,
	"transaction_model_id" uuid NOT NULL,
	"meta" jsonb,
	"lines" jsonb
);

CREATE TABLE "entries" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ref_id" varchar(64) NOT NULL UNIQUE,
	"alt_id" varchar(64) UNIQUE,
	"ledger_id" uuid NOT NULL,
	"debit_account_id" uuid NOT NULL,
	"credit_account_id" uuid NOT NULL,
	"uom_id" uuid NOT NULL,
	"value" numeric(64, 16) DEFAULT '0',
	"transaction_id" uuid NOT NULL
);

CREATE TABLE "entities" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ref_id" varchar(64) NOT NULL UNIQUE,
	"alt_id" varchar(64) UNIQUE,
	"entity_model_id" uuid NOT NULL,
	"parent_id" uuid,
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
	"from_uom_id" uuid NOT NULL,
	"to_uom_id" uuid NOT NULL,
	"rate" numeric(24, 8) NOT NULL
);

-- Add all foreign key constraints
ALTER TABLE "units" ADD CONSTRAINT "units_unit_type_id_unit_types_id_fk" FOREIGN KEY ("unit_type_id") REFERENCES "public"."unit_types"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "ledgers" ADD CONSTRAINT "ledgers_unit_type_id_unit_types_id_fk" FOREIGN KEY ("unit_type_id") REFERENCES "public"."unit_types"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_ledger_id_ledgers_id_fk" FOREIGN KEY ("ledger_id") REFERENCES "public"."ledgers"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_parent_id_accounts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_transaction_model_id_transaction_models_id_fk" FOREIGN KEY ("transaction_model_id") REFERENCES "public"."transaction_models"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "entries" ADD CONSTRAINT "entries_ledger_id_ledgers_id_fk" FOREIGN KEY ("ledger_id") REFERENCES "public"."ledgers"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "entries" ADD CONSTRAINT "entries_debit_account_id_accounts_id_fk" FOREIGN KEY ("debit_account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "entries" ADD CONSTRAINT "entries_credit_account_id_accounts_id_fk" FOREIGN KEY ("credit_account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "entries" ADD CONSTRAINT "entries_uom_id_units_id_fk" FOREIGN KEY ("uom_id") REFERENCES "public"."units"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "entries" ADD CONSTRAINT "entries_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "entities" ADD CONSTRAINT "entities_entity_model_id_entity_models_id_fk" FOREIGN KEY ("entity_model_id") REFERENCES "public"."entity_models"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "entities" ADD CONSTRAINT "entities_parent_id_entities_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "dimensions" ADD CONSTRAINT "dimensions_entry_id_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."entries"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "dimensions" ADD CONSTRAINT "dimensions_entity_model_id_entity_models_id_fk" FOREIGN KEY ("entity_model_id") REFERENCES "public"."entity_models"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "dimensions" ADD CONSTRAINT "dimensions_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "conversion_rates" ADD CONSTRAINT "conversion_rates_from_uom_id_units_id_fk" FOREIGN KEY ("from_uom_id") REFERENCES "public"."units"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "conversion_rates" ADD CONSTRAINT "conversion_rates_to_uom_id_units_id_fk" FOREIGN KEY ("to_uom_id") REFERENCES "public"."units"("id") ON DELETE no action ON UPDATE no action;

-- Finally, create all indexes for performance
CREATE INDEX "accounts_balance_type_index" ON "accounts" ("balance_type");
CREATE INDEX "accounts_name_index" ON "accounts" ("name");
CREATE INDEX "accounts_ref_id_index" ON "accounts" ("ref_id");
CREATE INDEX "accounts_alt_id_index" ON "accounts" ("alt_id");
CREATE INDEX "dimensions_entry_id_index" ON "dimensions" ("entry_id");
CREATE INDEX "dimensions_entity_model_id_index" ON "dimensions" ("entity_model_id");
CREATE INDEX "dimensions_entity_id_index" ON "dimensions" ("entity_id");
CREATE INDEX "entities_ref_id_index" ON "entities" ("ref_id");
CREATE INDEX "entities_alt_id_index" ON "entities" ("alt_id");
CREATE INDEX "entities_name_index" ON "entities" ("name");
CREATE INDEX "entity_models_ref_id_index" ON "entity_models" ("ref_id");
CREATE INDEX "entity_models_alt_id_index" ON "entity_models" ("alt_id");
CREATE INDEX "entity_models_name_index" ON "entity_models" ("name");
CREATE INDEX "entries_ref_id_index" ON "entries" ("ref_id");
CREATE INDEX "entries_alt_id_index" ON "entries" ("alt_id");
CREATE INDEX "ledgers_name_index" ON "ledgers" ("name");
CREATE INDEX "ledgers_ref_id_index" ON "ledgers" ("ref_id");
CREATE INDEX "ledgers_alt_id_index" ON "ledgers" ("alt_id");
CREATE INDEX "transaction_models_ref_id_index" ON "transaction_models" ("ref_id");
CREATE INDEX "transaction_models_alt_id_index" ON "transaction_models" ("alt_id");
CREATE INDEX "transaction_models_name_index" ON "transaction_models" ("name");
CREATE INDEX "transactions_ref_id_index" ON "transactions" ("ref_id");
CREATE INDEX "transactions_alt_id_index" ON "transactions" ("alt_id");
CREATE INDEX "unit_types_name_index" ON "unit_types" ("name");
CREATE INDEX "unit_types_ref_id_index" ON "unit_types" ("ref_id");
CREATE INDEX "unit_types_alt_id_index" ON "unit_types" ("alt_id");
CREATE INDEX "units_ref_id_index" ON "units" ("ref_id");
CREATE INDEX "units_alt_id_index" ON "units" ("alt_id");
CREATE INDEX "units_name_index" ON "units" ("name");
CREATE INDEX "units_symbol_index" ON "units" ("symbol");


---