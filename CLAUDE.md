# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bookmarket is a bookmark management application with a monorepo architecture using Turborepo and pnpm. The project consists of:

- **Frontend (Web)**: Next.js application (`apps/web`) - bookmark management interface
- **Backend (Server)**: NestJS API (`apps/server`) - authentication, bookmark/category CRUD operations  
- **Database**: PostgreSQL with TypeORM migrations
- **Authentication**: JWT tokens with Google/GitHub OAuth integration

## Development Commands

### Core Development
```bash
# Start development environment (includes Docker database)
pnpm dev

# Run individual applications
pnpm --filter bookmarket-web dev      # Frontend only
pnpm --filter bookmarket-server dev   # Backend only

# Build all applications
pnpm build

# Code quality checks
pnpm lint          # ESLint across all packages
pnpm format        # Prettier formatting
pnpm check-types   # TypeScript checking
```

### Database Operations
```bash
# Navigate to server directory first
cd apps/server

# Generate new migration
pnpm run migration:generate migration-name

# Run migrations
pnpm run migration:run

# Revert last migration  
pnpm run migration:revert
```

### Testing
```bash
# Server tests
cd apps/server
pnpm test                    # Run all tests
pnpm test:watch             # Watch mode
pnpm test:cov               # With coverage
pnpm test:e2e               # End-to-end tests
```

## Architecture

### Backend Structure (`apps/server/src/`)
- **Authentication**: JWT-based auth with OAuth in `iam/` module
  - Local sign-up/sign-in with bcrypt hashing
  - Google/GitHub OAuth integration
  - Cookie-based JWT token management
- **Core Modules**:
  - `bookmarks/` - Bookmark CRUD operations with metadata fetching
  - `categories/` - Category management for organizing bookmarks
  - `users/` - User profile management
- **Database**: TypeORM with PostgreSQL, migrations in `migrations/`
- **Base Entity**: Common fields (id, createdAt, updatedAt) in `common/entities/base.entity.ts`

### Frontend Structure (`apps/web/src/`)
- **App Router**: Next.js 13+ with nested routing in `app/` directory
- **Authentication Pages**: `(auth)/` route group for login/signup/oauth
- **Main Application**: `(home)/` route group with bookmark management interface
- **Shared Profiles**: `(shared)/` route group for public bookmark sharing
- **State Management**: 
  - Zustand stores in `_state/store/`
  - TanStack Query for server state in `_common/state/query/`
- **UI Components**: Radix UI primitives with custom styling in `_core/components/`
- **Styling**: Tailwind CSS with custom utilities

### Key Features
- **Command Menu**: Global search/command interface using `cmdk`
- **Bookmark Management**: URL input with automatic metadata fetching via server-side service
- **Categories**: Organize bookmarks with drag-and-drop interface  
- **Public Sharing**: Share bookmark collections via public URLs
- **PWA Support**: Progressive Web App with offline capabilities
- **Error Monitoring**: Sentry integration for both frontend and backend
- **Self-Hosted Metadata**: Server-side metadata and favicon extraction without external API dependencies

## Environment Setup

### Required Environment Variables
- Database: `DATABASE_URL`, `POSTGRES_*` variables
- OAuth: `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- Base URLs: `NEXT_PUBLIC_BASE_URL`
- Monitoring: Sentry keys for error tracking

### Docker Development
```bash
# Start database only (used by pnpm dev)
docker compose up db -d
```

## Package Management
- Uses pnpm workspaces with shared configs in `packages/`
- Shared ESLint, Prettier, and TypeScript configurations across apps
- Package manager version pinned to pnpm@8.9.2