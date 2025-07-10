-- UP MIGRATION
-- Remove sessions table and keep only api_tokens for machine-to-machine auth
-- Sessions are now stored entirely in Valkey cache

-- Table for API tokens (machine-to-machine)
CREATE TABLE "api_tokens" (
    "id" uuid PRIMARY KEY NOT NULL,
    "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "token_name" varchar(255) NOT NULL,
    "token_hash" varchar(255) NOT NULL UNIQUE,
    "scopes" jsonb DEFAULT '[]'::jsonb,
    "last_used_at" timestamptz,
    "expires_at" timestamptz,
    "revoked_at" timestamptz,
    "created_at" timestamptz DEFAULT now(),
    "updated_at" timestamptz DEFAULT now()
);

-- Index for faster lookups
CREATE INDEX "idx_api_tokens_token_hash" ON "api_tokens"("token_hash");
CREATE INDEX "idx_api_tokens_user_id" ON "api_tokens"("user_id");
CREATE INDEX "idx_api_tokens_expires_at" ON "api_tokens"("expires_at");
CREATE INDEX "idx_api_tokens_revoked_at" ON "api_tokens"("revoked_at");
