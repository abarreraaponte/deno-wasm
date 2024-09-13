CREATE TABLE IF NOT EXISTS "organization_users" (
	"user_id" varchar(26),
	"organization_id" varchar(26)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizations" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"name" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"email" varchar(255),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_users" ADD CONSTRAINT "organization_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_users" ADD CONSTRAINT "organization_users_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "users" USING btree ("email");