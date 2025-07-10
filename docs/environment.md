# Environment Variables

This document lists all environment variables used by KitLedger, their purposes, and default values.

## Required Variables

These variables **must** be set for the application to start:

### `KL_DATABASE_URL`
- **Type**: String (PostgreSQL connection URL)
- **Required**: ✅ Yes
- **Example**: `postgres://user:password@localhost:5432/kitledger?sslmode=disable`
- **Description**: PostgreSQL database connection string

### `KL_JWT_SECRET`
- **Type**: String
- **Required**: ✅ Yes
- **Example**: `your-super-secret-jwt-key-change-this-in-production`
- **Description**: Secret key for signing JWT tokens. Must be unique per deployment for security.

## Optional Variables

These variables have sensible defaults and only need to be set when customization is required:

### Server Configuration

#### `KL_SERVER_PORT`
- **Type**: Integer
- **Default**: `8000`
- **Example**: `8080`
- **Description**: HTTP server port

### Database Configuration

#### `KL_DATABASE_POOL_MAX_SIZE`
- **Type**: Integer
- **Default**: `10`
- **Example**: `20`
- **Description**: Maximum number of database connections in the pool

### Cache Configuration

#### `KL_VALKEY_URL`
- **Type**: String (Valkey/Redis URL)
- **Default**: `valkey://localhost:6379/0`
- **Examples**: 
  - Basic: `valkey://localhost:6379/0`
  - With password: `valkey://:password@localhost:6379/0`
  - Different database: `valkey://localhost:6379/5`
  - Different host: `valkey://cache.example.com:6379/0`
- **Description**: Valkey (Redis-compatible) server connection URL including optional password and database selection

### Authentication Configuration

#### `KL_SESSION_TTL_HOURS`
- **Type**: Integer
- **Default**: `168` (7 days)
- **Example**: `24` (1 day)
- **Description**: Session lifetime in hours

#### `KL_COOKIE_DOMAIN`
- **Type**: String
- **Default**: Empty (browser uses current domain)
- **Example**: `.example.com`
- **Description**: Cookie domain for session cookies. Leave empty for single-domain apps.

#### `KL_COOKIE_SECURE`
- **Type**: Boolean
- **Default**: `false`
- **Example**: `true`
- **Description**: Whether cookies require HTTPS. Set to `true` in production.

#### `KL_COOKIE_SAME_SITE`
- **Type**: String
- **Default**: `lax`
- **Options**: `strict`, `lax`, `none`
- **Description**: SameSite cookie policy for CSRF protection

#### `KL_ALLOWED_ORIGINS`
- **Type**: Comma-separated list
- **Default**: `http://localhost:3000`
- **Example**: `https://app.example.com,https://admin.example.com`
- **Description**: CORS allowed origins for frontend applications

#### `KL_AUTH_PROVIDER`
- **Type**: String
- **Default**: `simple`
- **Options**: `simple`, `oauth2`
- **Description**: Authentication provider type. Reserved for future OAuth2 integration.

#### `KL_TOKEN_REVOCATION_TTL_DAYS`
- **Type**: Integer
- **Default**: `30`
- **Example**: `90`
- **Description**: How long to keep revoked token information for audit purposes

## Environment File Examples

### Minimal .env (Required only)
```bash
KL_DATABASE_URL="postgres://postgres:password@localhost:5432/kitledger"
KL_JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

### Development .env
```bash
KL_DATABASE_URL="postgres://postgres:password@localhost:5432/kitledger"
KL_JWT_SECRET="dev-secret-key-not-for-production"
KL_SERVER_PORT=8000
KL_ALLOWED_ORIGINS="http://localhost:3000,http://localhost:8080"
```

### Production .env
```bash
KL_DATABASE_URL="postgres://prod_user:secure_password@db.example.com:5432/kitledger_prod?sslmode=require"
KL_JWT_SECRET="very-long-random-production-secret-key-generated-securely"
KL_SERVER_PORT=8000
KL_VALKEY_URL="valkey://:redis_password@cache.example.com:6379/0"
KL_COOKIE_SECURE=true
KL_COOKIE_DOMAIN=".example.com"
KL_ALLOWED_ORIGINS="https://app.example.com,https://admin.example.com"
KL_SESSION_TTL_HOURS=24
```

## Security Notes

1. **JWT Secret**: Generate a long, random string for production. Never commit secrets to version control.
2. **Cookie Security**: Always set `KL_COOKIE_SECURE=true` in production with HTTPS.
3. **CORS Origins**: Be specific about allowed origins in production. Avoid wildcards.
4. **Database URL**: Use connection pooling and SSL in production.

## Loading Priority

The application loads configuration in this order:
1. Environment variables
2. `.env` file in the working directory
3. Default values (defined in `internal/config/config.go`)

Environment variables always take precedence over `.env` file values.
