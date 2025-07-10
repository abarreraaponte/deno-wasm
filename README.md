# KitLedger

A financial ledger system with JWT authentication and API management.

## Features

- JWT Authentication for SPAs and machine-to-machine integrations
- Session-based authentication using HTTP-only cookies  
- API token management for programmatic access
- Valkey/Redis session storage
- PostgreSQL database with migrations
- RESTful API endpoints

## CLI Usage

KitLedger provides a single binary with multiple commands:

### Start the Server

```bash
./bin/kitledger serve
```

This starts the HTTP server on the configured port (default: 8000).

### Generate API Tokens

```bash
./bin/kitledger generate-token [user_id] --name "Token Name"
```

Example:
```bash
./bin/kitledger generate-token 8f650544-c29a-4843-8882-52ff4df0f0b2 --name "Postman Testing"
```

This generates a new API token for machine-to-machine authentication. The token is displayed once and cannot be retrieved again.

### Help

```bash
./bin/kitledger --help
./bin/kitledger serve --help
./bin/kitledger generate-token --help
```

## Configuration

Configure the application using environment variables or a `.env` file:

- `KL_DATABASE_URL` - PostgreSQL connection string (required)
- `KL_JWT_SECRET` - JWT signing secret (required)
- `KL_SERVER_PORT` - Server port (default: 8000)
- `KL_VALKEY_URL` - Valkey/Redis connection URL (default: valkey://localhost:6379/0)
- `KL_SESSION_TTL_HOURS` - Session timeout in hours (default: 168)
- `KL_COOKIE_DOMAIN` - Cookie domain (default: localhost)
- `KL_ALLOWED_ORIGINS` - CORS allowed origins (comma-separated)

See [docs/environment.md](docs/environment.md) for complete configuration details.

## API Documentation

See [docs/authentication.md](docs/authentication.md) for API endpoint documentation.
