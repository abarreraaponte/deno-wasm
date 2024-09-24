ALTER TABLE "entries" ADD COLUMN "dimensions" jsonb;--> statement-breakpoint
ALTER TABLE "transaction_models" ADD COLUMN "requires_lines" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "lines" jsonb;