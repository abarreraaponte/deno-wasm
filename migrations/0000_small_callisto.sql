CREATE TABLE IF NOT EXISTS "account_types" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "account_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"parent_id" varchar(26),
	"name" varchar(255) NOT NULL,
	"meta" jsonb,
	CONSTRAINT "accounts_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "currencies" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"symbol" varchar(20) NOT NULL,
	"code" varchar(8) NOT NULL,
	"precision" integer DEFAULT 0,
	"active" boolean DEFAULT true,
	"decimal_separator" char(1) NOT NULL,
	"thousands_separator" char(1) NOT NULL,
	CONSTRAINT "currencies_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entities" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"entity_model_id" varchar(26) NOT NULL,
	"parent_id" varchar(26),
	"name" varchar(255) NOT NULL,
	"meta" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entity_models" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "entity_models_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entries" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"transaction_id" varchar(26) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exchange_rates" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"from_currency_id" varchar(26) NOT NULL,
	"to_currency_id" varchar(26) NOT NULL,
	"rate" bigint DEFAULT 1,
	"valid_from" bigint NOT NULL,
	"valid_to" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ledgers" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"currency_id" varchar(26) NOT NULL,
	"dimension_1_id" varchar(26),
	"dimension_2_id" varchar(26),
	"dimension_3_id" varchar(26),
	"dimension_4_id" varchar(26),
	"dimension_5_id" varchar(26),
	"dimension_6_id" varchar(26),
	"dimension_7_id" varchar(26),
	"dimension_8_id" varchar(26),
	"active" boolean DEFAULT true,
	CONSTRAINT "ledgers_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction_models" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "transaction_models_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"transaction_model_id" varchar(26) NOT NULL,
	"meta" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "uom" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"uom_type_id" varchar(26) NOT NULL,
	"name" varchar(255) NOT NULL,
	"plural_name" varchar(255) NOT NULL,
	"symbol" varchar(20) NOT NULL,
	"plural_symbol" varchar(20) NOT NULL,
	CONSTRAINT "uom_name_unique" UNIQUE("name"),
	CONSTRAINT "uom_plural_name_unique" UNIQUE("plural_name"),
	CONSTRAINT "uom_symbol_unique" UNIQUE("symbol"),
	CONSTRAINT "uom_plural_symbol_unique" UNIQUE("plural_symbol")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "uom_types" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "uom_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_parent_id_accounts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entities" ADD CONSTRAINT "entities_entity_model_id_entity_models_id_fk" FOREIGN KEY ("entity_model_id") REFERENCES "public"."entity_models"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entities" ADD CONSTRAINT "entities_parent_id_entities_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entries" ADD CONSTRAINT "entries_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_from_currency_id_currencies_id_fk" FOREIGN KEY ("from_currency_id") REFERENCES "public"."currencies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_to_currency_id_currencies_id_fk" FOREIGN KEY ("to_currency_id") REFERENCES "public"."currencies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ledgers" ADD CONSTRAINT "ledgers_currency_id_currencies_id_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."currencies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ledgers" ADD CONSTRAINT "ledgers_dimension_1_id_entity_models_id_fk" FOREIGN KEY ("dimension_1_id") REFERENCES "public"."entity_models"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ledgers" ADD CONSTRAINT "ledgers_dimension_2_id_entity_models_id_fk" FOREIGN KEY ("dimension_2_id") REFERENCES "public"."entity_models"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ledgers" ADD CONSTRAINT "ledgers_dimension_3_id_entity_models_id_fk" FOREIGN KEY ("dimension_3_id") REFERENCES "public"."entity_models"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ledgers" ADD CONSTRAINT "ledgers_dimension_4_id_entity_models_id_fk" FOREIGN KEY ("dimension_4_id") REFERENCES "public"."entity_models"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ledgers" ADD CONSTRAINT "ledgers_dimension_5_id_entity_models_id_fk" FOREIGN KEY ("dimension_5_id") REFERENCES "public"."entity_models"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ledgers" ADD CONSTRAINT "ledgers_dimension_6_id_entity_models_id_fk" FOREIGN KEY ("dimension_6_id") REFERENCES "public"."entity_models"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ledgers" ADD CONSTRAINT "ledgers_dimension_7_id_entity_models_id_fk" FOREIGN KEY ("dimension_7_id") REFERENCES "public"."entity_models"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ledgers" ADD CONSTRAINT "ledgers_dimension_8_id_entity_models_id_fk" FOREIGN KEY ("dimension_8_id") REFERENCES "public"."entity_models"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_transaction_model_id_transaction_models_id_fk" FOREIGN KEY ("transaction_model_id") REFERENCES "public"."transaction_models"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "uom" ADD CONSTRAINT "uom_uom_type_id_uom_types_id_fk" FOREIGN KEY ("uom_type_id") REFERENCES "public"."uom_types"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_types_name_index" ON "account_types" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "accounts_name_index" ON "accounts" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "currencies_code_index" ON "currencies" USING btree ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "currencies_name_index" ON "currencies" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "entities_name_index" ON "entities" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "entity_models_name_index" ON "entity_models" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "exchange_rates_valid_from_index" ON "exchange_rates" USING btree ("valid_from");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "exchange_rates_valid_to_index" ON "exchange_rates" USING btree ("valid_to");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ledgers_name_index" ON "ledgers" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transaction_models_name_index" ON "transaction_models" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "uom_name_index" ON "uom" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "uom_plural_name_index" ON "uom" USING btree ("plural_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "uom_symbol_index" ON "uom" USING btree ("symbol");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "uom_plural_symbol_index" ON "uom" USING btree ("plural_symbol");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "uom_types_name_index" ON "uom_types" USING btree ("name");