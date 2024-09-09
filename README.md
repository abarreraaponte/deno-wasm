
# EntropyERP Monorepo Project

This repository contains a full-stack application with a React frontend, a Hono backend, and additional packages for core business logic and localization, all managed in a monorepo structure.

## Project Structure

```
root/
├── packages/
│   ├── client/         # React frontend
│   │   ├── src/
│   │   └── package.json
│   ├── server/         # Hono backend (HTTP layer, authentication, authorization, tRPC, API routes, middleware)
│   │   ├── src/
│   │   └── package.json
│   ├── core/           # Core business logic
│   │   ├── src/
│   │   └── package.json
│   ├── localization/   # Localization and market-specific logic
│   │   ├── src/
│   │   └── package.json
├── package.json        # Root package.json
└── README.md           # This file
```

## Tech Stack

### Frontend (client)
- React 18
- TypeScript
- Vite
- TailwindCSS
- Shadcn UI

### Backend (server)
- Hono
- Node.js
- TypeScript
- tRPC (for type-safe API calls between frontend and backend)

### Core
- TypeScript
- Business logic modules

### Localization
- TypeScript
- Market-specific adaptations

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development servers:
   ```
   npm run dev
   ```

   This will start all necessary services in development mode.

3. Build the project:
   ```
   npm run build
   ```

   This will build all packages.

4. Start the production server:
   ```
   npm start
   ```

   This will start the backend server using the built files.

## Scripts

### Root
- `npm run dev`: Start all services in development mode
- `npm run build`: Build all packages
- `npm start`: Start the production server

### Frontend (client)
- `npm run dev`: Start Vite development server
- `npm run build`: Build the frontend application

### Backend (server)
- `npm run dev`: Start the backend in development mode with hot-reloading
- `npm run build`: Build the backend
- `npm start`: Start the production backend server

### Core
- `npm run build`: Build the core package

### Localization
- `npm run build`: Build the localization package

## tRPC Integration

The `server` package contains the tRPC setup, enabling type-safe API calls between the frontend and backend. The server package interfaces with the `core` package to execute business logic.

## Localization

The `localization` package contains market-specific adaptations and is used by the `server`, `client`, and `core` packages to tailor the system to certain countries or markets.

## Environment Variables

Make sure to set up your environment variables in a `.env` file in the root directory. The backend uses `dotenv` to load these variables.

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

EntropyERP - Proprietary and Confidential

Copyright (c) [2024] Entropy Technologies SPA. All Rights Reserved.

This software and its documentation are protected by copyright law and international treaties. Unauthorized reproduction, distribution, or use of this software, in whole or in part, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.

This software is provided under a license agreement and may be used only in accordance with the terms of that agreement. No part of this software or its documentation may be copied, modified, distributed, or sublicensed without prior written permission from Entropy Technologies SPA.

For licensing inquiries, please contact: alejandro@entropyservices.com