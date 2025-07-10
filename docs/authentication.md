# Authentication System

KitLedger implements a flexible JWT-based authentication system that supports both SPA (Single Page Application) authentication and machine-to-machine integrations.

## Authentication Methods

### 1. Session-Based Authentication (for SPAs)

SPAs authenticate using session cookies. This provides a secure way to maintain user sessions without exposing JWT tokens to client-side JavaScript.

**Flow:**
1. User logs in with email/password
2. Server creates a session and stores it entirely in Valkey cache
3. Session token is sent as an HTTP-only, secure cookie
4. Subsequent requests are authenticated using the session cookie (Valkey lookup only)
5. Sessions can be refreshed to extend the expiry time

**Endpoints:**
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and create session
- `POST /api/auth/logout` - Logout and destroy session
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/refresh` - Refresh current session

### 2. API Token Authentication (for Machine-to-Machine)

Long-lived API tokens for server-to-server communication. These tokens can be scoped and revoked as needed.

**Flow:**
1. User creates an API token via the web interface
2. Token is provided once and stored as a hash
3. API requests include the token in the `Authorization: Bearer <token>` header
4. Tokens can have expiration dates and can be revoked

**Endpoints:**
- `POST /api/auth/tokens` - Create a new API token
- `GET /api/auth/tokens` - List user's API tokens
- `DELETE /api/auth/tokens/:tokenId` - Revoke an API token

## Configuration

Set these environment variables:

```bash
# Required
KL_JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Optional (with defaults)
KL_SESSION_TTL_HOURS=168  # 7 days
KL_COOKIE_DOMAIN=localhost
KL_COOKIE_SECURE=false  # Set to true in production with HTTPS
KL_COOKIE_SAME_SITE=lax  # lax, strict, or none
KL_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
KL_AUTH_PROVIDER=simple  # simple or oauth2 (for future extensibility)
KL_TOKEN_REVOCATION_TTL_DAYS=30

# Valkey Cache
KL_VALKEY_URL=valkey://localhost:6379/0
KL_VALKEY_PASSWORD=
KL_VALKEY_DB=0
```

## Security Features

### Session Management
- Sessions are stored entirely in Valkey cache for maximum performance
- Session tokens are cryptographically secure random strings
- Sessions automatically expire and are cleaned up by TTL
- HTTP-only cookies prevent XSS attacks
- Configurable cookie security settings (Secure, SameSite)
- Complete session metadata preserved in cache (device info, IP, user agent)

### API Token Security
- Tokens are hashed using SHA256 before storage
- Tokens can be scoped (future feature)
- Tokens can have expiration dates
- Tokens can be revoked instantly
- Last usage tracking for audit purposes

### Password Security
- Passwords are hashed using bcrypt with default cost
- No plaintext passwords are stored

### JWT Security
- JWTs are signed using HMAC-SHA256
- Short expiration times tied to session/token expiry
- Claims include user ID, session/token ID, and type

## Cache Strategy

The system uses Valkey (Redis-compatible) for caching:

- **Session Storage**: Complete session data stored in Valkey (no database queries for session validation)
- **API Token Cache**: Future feature for caching API token validation
- **Rate Limiting**: Foundation for future rate limiting (future feature)

Session entries have TTL matching the session expiry times and include complete metadata.

## Future OAuth2 Integration

The system is designed to be extensible to OAuth2:

- `KL_AUTH_PROVIDER` environment variable allows switching between `simple` and `oauth2`
- User model and session structure are compatible with OAuth2 flows
- API token system can be extended to support OAuth2 client credentials flow
- JWT structure includes necessary claims for OAuth2 scopes

## API Examples

### Register a User
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe", 
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Create API Token
```bash
curl -X POST http://localhost:8000/api/auth/tokens \
  -H "Content-Type: application/json" \
  -H "Cookie: session_token=your_session_token" \
  -d '{
    "token_name": "My API Integration",
    "scopes": ["read", "write"],
    "expires_at": "2025-12-31T23:59:59Z"
  }'
```

### Use API Token
```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer your_api_token"
```

## Database Schema

The authentication system adds this table:

### api_tokens
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to users)
- `token_name` (varchar)
- `token_hash` (varchar, unique)
- `scopes` (jsonb)
- `last_used_at` (timestamptz, optional)
- `expires_at` (timestamptz, optional)
- `revoked_at` (timestamptz, optional)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**Note**: Sessions are stored entirely in Valkey cache and do not require a database table.

Indexes are created for optimal query performance on token lookups and user associations.
