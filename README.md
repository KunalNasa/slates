# Slates - Collaborative Canvas Board

**Slates** is a collaborative canvas board where multiple users can draw together in real-time.

## Tech Stack

- PostgreSQL
- WebSockets
- Turborepo
- Canvas API
- BullMQ
- Redis
- Next.js
- Express
- Prisma

## How it works

- Real-time shape rendering is handled using WebSockets.
- Shapes are saved asynchronously to the database using BullMQ queues.
- The project uses a monorepo setup powered by Turborepo to manage multiple apps and packages.

## Repository Structure

```
apps/
  ├── http-backed       # Express backend for user, profile, and room management
  ├── ws-server         # WebSocket server for real-time drawing and room handling
  └── main-site         # Frontend built using Next.js

packages/
  ├── db                # Prisma setup and all DB models
  ├── backend-common    # Shared types and middlewares for backend services
  ├── common            # Common files shared across all apps
  └── design-system     # Tailwind CSS setup used across the project
```

## Getting Started

### Install dependencies

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

