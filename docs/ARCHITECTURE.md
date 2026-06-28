# Architecture Guide

## Overview

ProspectOS is built on a **layered architecture** that separates concerns between the frontend, API, business logic, data access, and infrastructure layers.

## Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│               BROWSER / CLIENT                       │
│  React Components · Zustand State · Framer Motion   │
├─────────────────────────────────────────────────────┤
│               NEXT.JS APP ROUTER                     │
│  Server Components · Route Handlers · Middleware     │
├────────────────────────┬────────────────────────────┤
│    FEATURE MODULES     │      API ROUTES             │
│  /features/*           │   /api/v1/*                 │
│  Auth, Leads,          │   REST · Validation         │
│  Campaigns, AI         │   Rate Limiting · Auth      │
├────────────────────────┴────────────────────────────┤
│               SERVICE LAYER                          │
│  Email · AI · Campaign · Analytics · Webhook        │
├─────────────────────────────────────────────────────┤
│               REPOSITORY LAYER                       │
│  Leads · Campaigns · Analytics · Notifications      │
├─────────────────────────────────────────────────────┤
│               DATABASE LAYER                         │
│  Prisma ORM · PostgreSQL · Redis (Cache/Queue)      │
└─────────────────────────────────────────────────────┘
```

## Key Design Decisions

### 1. No Database Required to Run
The frontend uses **Zustand** for client-side mock state. API routes detect `process.env.DATABASE_URL` and fall back to mock responses. This enables instant development without infrastructure setup.

### 2. Server-Sent Events (SSE) over WebSockets
WebSockets require a persistent server process — incompatible with serverless (Vercel, Cloudflare). SSE (`/api/v1/stream`) works everywhere, supports automatic reconnection, and is sufficient for unidirectional real-time updates (notifications, campaign progress).

### 3. Feature-Based Architecture
Code is organized by **feature domain** (`src/features/`) rather than by type (components, hooks, utils). Each feature exports its own types, hooks, and API client actions — making features independently deployable and testable.

### 4. Repository Pattern
Business logic never lives in API route handlers. The flow is:
```
Route Handler → Service Layer → Repository → Prisma → PostgreSQL
```
This isolates database queries, making them independently testable and swappable.

### 5. Middleware Composition
API routes compose middleware functions rather than using Next.js middleware (which runs on the edge and can't use Node.js APIs):

```typescript
// Every protected API route follows this pattern:
const rl = checkRateLimit(request, RateLimits.API);
if (!rl.allowed) return tooManyRequests(rl.retryAfter!);
const auth = await requireAuth(request);
if (!auth) return unauthorized();
```

### 6. Design System
Custom components in `src/components/ui/` are preferred over Shadcn UI for full design control. The system includes: `Button`, `GlassCard`, `Dialog`, `Input`, `Textarea`, `Badge`, `Tabs`, `Toast`.

## Database Schema

The Prisma schema (`prisma/schema.prisma`) follows these conventions:
- **UUID primary keys** on all entities
- **Soft deletes** via `deletedAt DateTime?` (no hard deletes for lead data)
- **Audit fields**: `createdAt`, `updatedAt` on all mutable entities
- **Workspace isolation**: every entity has a `workspaceId` FK for multi-tenancy
- **Cascade deletes**: workspace deletion cascades to all child records

## State Management

- **Zustand** (`src/lib/store.ts`): client-side application state (leads, campaigns, templates, workspace session)
- **Server state**: API routes + repositories for persistent data (when DB is connected)
- **Real-time state**: SSE hook updates Zustand notification store

## Future Extensions

The architecture anticipates these additions without major refactoring:
- **Voice Calling**: Add `src/features/voice/` + `/api/v1/calls/` route
- **WhatsApp**: Add `src/features/whatsapp/` + integration provider
- **Mobile App**: Feature modules can be imported directly into React Native
- **Plugin Marketplace**: Feature isolation makes each feature a potential plugin unit
- **Multi-tenant Enterprise**: Workspace isolation is already enforced at the DB level
- **Public API**: Rate limiting + API keys are already implemented
