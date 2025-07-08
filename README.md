# KitLedger

A financial ledger application built with Go and VueJS.

## Prerequisites

- Go 1.22 or later
- Node.js 18+ and npm
- PostgreSQL database

## Quick Start

1. Install dependencies and build:
```bash
./test.sh
```

2. Set up your database connection:
```bash
export KL_DATABASE_URL="postgres://username:password@localhost/kitledger?sslmode=disable"
```

3. Run the application:
```bash
./bin/kitledger
```

The application will be available at http://localhost:8000

## Configuration

Environment variables:
- `KL_DATABASE_URL` - PostgreSQL connection string (required)
- `KL_SERVER_PORT` - Server port (default: 8000)
- `KL_DATABASE_POOL_MAX_SIZE` - Database connection pool size (default: 10)

## Development

Build and run:
```bash
make run
```

Clean build artifacts:
```bash
make clean
```

Run tests:
```bash
make test
```

## Project Structure

- `main.go` - Application entry point
- `internal/config/` - Configuration management
- `internal/database/` - Database connection and migrations
- `internal/models/` - Data models
- `internal/router/` - HTTP routes and handlers
- `web/` - VueJS frontend
