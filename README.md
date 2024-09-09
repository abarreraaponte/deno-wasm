# EntropyERP Monorepo Project

This repository contains a full-stack application with a React frontend, a Hono backend, all managed in a monorepo structure.

## Project Structure

```
root/
├── packages/
│   ├── client/         # React frontend
│   │   ├── src/
│   │   └── package.json
│   ├── server/         # Hono backend
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
- DaisyUI

### Backend (server)
- Hono
- Node.js
- TypeScript
- tRPC (for type-safe API calls between frontend and backend)


## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development servers:
   ```
   npm run dev
   ```

   This will start both the frontend and backend in development mode.

3. Build the project:
   ```
   npm run build
   ```

   This will build the frontend and backend.

4. Start the production server:
   ```
   npm start
   ```

   This will start the backend server using the built files.

## Scripts

### Root
- `npm run dev`: Start both frontend and backend in development mode
- `npm run build`: Build frontend and backend
- `npm start`: Start the production server

### Frontend (client)
- `npm run dev`: Start Vite development server
- `npm run build`: Build the frontend application

### Backend (server)
- `npm run dev`: Start the backend in development mode with hot-reloading
- `npm run build`: Build the backend
- `npm start`: Start the production backend server

## tRPC Integration

The `server` directory contains the tRPC setup in `trpc.ts`. This enables type-safe API calls between the frontend and backend. The `trpc.ts` file is directly imported by both the client and server packages, ensuring type consistency across the full stack.

## Environment Variables

Make sure to set up your environment variables in a `.env` file in the root directory. The backend uses `dotenv` to load these variables.

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

[Add your chosen license here]
