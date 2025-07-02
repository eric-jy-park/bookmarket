# Bookmarket

### (Don't) Manage your bookmarks (with Chrome)

![screenshot-with-background (2)](https://github.com/user-attachments/assets/a59c0c27-e4be-4226-a708-8d2dda4471f7)

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.0-red?logo=nestjs)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker)](https://www.docker.com/)

</div>

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#️-installation)
- [Development](#-development)
- [API Documentation](#-api-documentation)
- [Database](#️-database)
- [Deployment](#-deployment)
- [Security](#-security)
- [PWA Features](#-pwa-features)
- [Testing](#-testing)
- [Code Quality](#-code-quality)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

Bookmarket is a modern, full-stack bookmark management application designed to
replace traditional browser bookmark systems. Built with a focus on user
experience, performance, and self-hosting capabilities, it provides a
comprehensive solution for organizing, sharing, and discovering web content.

The application features a **monorepo architecture** using Turborepo and pnpm,
consisting of a Next.js frontend, NestJS backend, and PostgreSQL database, all
orchestrated with Docker for seamless development and deployment.

## 🚀 Features

### Core Functionality

- **🔐 Multi-Provider Authentication**: JWT-based auth with Google and GitHub
  OAuth integration
- **📚 Smart Bookmark Management**: URL input with automatic metadata and
  favicon fetching
- **🏷️ Category Organization**: Drag-and-drop interface for organizing bookmarks
  into categories
- **🌐 Public Sharing**: Share bookmark collections via clean, public URLs
  (`/s/username`)
- **⌨️ Command Menu**: Global search and command interface using cmdk for power
  users
- **📱 Progressive Web App**: Full PWA support with offline capabilities and
  native app-like experience

### Advanced Features

- **🔍 Self-Hosted Metadata**: Server-side metadata extraction without external
  API dependencies
- **📊 Error Monitoring**: Comprehensive Sentry integration for both frontend
  and backend
- **🎨 Dark/Light Mode**: System-aware theme switching with Tailwind CSS
- **🔄 Real-time Updates**: Optimistic UI updates with TanStack Query
- **🎯 Type Safety**: End-to-end TypeScript for robust development experience
- **🔒 Security Headers**: Comprehensive security headers and CSP policies
- **📐 Responsive Design**: Mobile-first design that works across all devices

## 🏗 Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                       │
│  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────┐ │
│  │  App Router     │  │  Server Actions  │  │  Client State   │ │
│  │  (Pages)        │  │  (API Calls)     │  │  (Zustand)      │ │
│  └─────────────────┘  └──────────────────┘  └─────────────────┘ │
│  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────┐ │
│  │  UI Components  │  │  TanStack Query  │  │  PWA Service    │ │
│  │  (Radix UI)     │  │  (Server State)  │  │  Worker         │ │
│  └─────────────────┘  └──────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   │ HTTP/REST API
                                   │
┌─────────────────────────────────────────────────────────────────┐
│                        Backend (NestJS)                         │
│  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────┐ │
│  │  Controllers    │  │  Services        │  │  Guards &       │ │
│  │  (REST API)     │  │  (Business Logic)│  │  Middleware     │ │
│  └─────────────────┘  └──────────────────┘  └─────────────────┘ │
│  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────┐ │
│  │  JWT Auth       │  │  Metadata        │  │  TypeORM        │ │
│  │  (OAuth + Local)│  │  Scraping        │  │  (Database)     │ │
│  └─────────────────┘  └──────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   │ SQL Queries
                                   │
┌─────────────────────────────────────────────────────────────────┐
│                      Database (PostgreSQL)                      │
│  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────┐ │
│  │  Users          │  │  Bookmarks       │  │  Categories     │ │
│  │  (Auth Data)    │  │  (URLs + Meta)   │  │  (Organization) │ │
│  └─────────────────┘  └──────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Authentication Flow**: OAuth providers → JWT tokens → Cookie storage →
   Request headers
2. **Bookmark Creation**: URL input → Metadata fetching → Database storage →
   Real-time UI updates
3. **Category Management**: Drag-and-drop → Optimistic updates → API calls →
   State synchronization
4. **Public Sharing**: Username-based URLs → Public API endpoints → Cached
   responses

## 🛠️ Tech Stack

### Frontend Stack

- **🚀 Next.js 15** - React framework with App Router for server-side rendering
  and static generation
- **⚛️ React 19** - Latest React with concurrent features and improved
  performance
- **📘 TypeScript 5.7** - Static type checking for robust development
- **🎨 Tailwind CSS 3.4** - Utility-first CSS framework with custom design
  system
- **🧩 Radix UI** - Accessible, unstyled component primitives
- **✨ Framer Motion 11** - Production-ready motion library for React
- **🔄 TanStack Query 5** - Powerful data synchronization for server state
- **🐻 Zustand 5** - Small, fast, and scalable state management
- **📊 Sentry** - Real-time error tracking and performance monitoring
- **📱 Next PWA** - Progressive Web App features with Workbox
- **⌨️ cmdk** - Fast, composable command menu interface
- **🌙 next-themes** - Perfect dark mode implementation
- **🔍 nuqs** - Type-safe search params state management

### Backend Stack

- **🏗️ NestJS 10** - Progressive Node.js framework for scalable server-side
  applications
- **📘 TypeScript 5** - Full-stack type safety
- **🐘 PostgreSQL** - Advanced open-source relational database
- **🔧 TypeORM 0.3** - TypeScript ORM with migrations and relationships
- **🔑 JWT Authentication** - Secure token-based authentication with cookie
  storage
- **🔐 OAuth Integration** - Google and GitHub OAuth providers
- **🔒 bcrypt** - Secure password hashing
- **🕷️ Cheerio** - Server-side HTML parsing for metadata extraction
- **📊 Sentry** - Backend error tracking and performance monitoring
- **🍪 cookie-parser** - HTTP cookie parsing middleware
- **🎯 class-validator** - Decorator-based validation for DTOs

### Development & DevOps

- **📚 Turborepo 2.4** - High-performance build system for JavaScript monorepos
- **📦 pnpm 8.9.2** - Fast, disk space efficient package manager
- **🔍 ESLint 8** - Static code analysis with custom rules and plugins
- **✨ Prettier 3** - Opinionated code formatter with Tailwind plugin
- **🐳 Docker Compose** - Multi-container development environment
- **🧪 Jest** - Comprehensive testing framework for backend
- **🔗 GitHub Actions** - CI/CD pipeline for automated testing and deployment

### Additional Tools & Libraries

- **🌐 Geist Font** - Modern, clean typography
- **🎭 Lucide React** - Beautiful, customizable SVG icons
- **📋 React Hook Form** - Performant, flexible forms with easy validation
- **🔔 Sonner** - Elegant toast notifications
- **🎪 Vaul** - Accessible drawer component for mobile interfaces
- **📐 class-variance-authority** - TypeScript-first variant API for component
  styling

## 📁 Project Structure

```
bookmarket/
├── 📁 apps/
│   ├── 📁 web/                    # Next.js Frontend Application
│   │   ├── 📁 src/
│   │   │   ├── 📁 app/           # Next.js App Router
│   │   │   │   ├── 📁 (pages)/   # Route Groups
│   │   │   │   │   ├── 📁 (auth)/        # Authentication pages
│   │   │   │   │   │   ├── 📁 login/
│   │   │   │   │   │   ├── 📁 signup/
│   │   │   │   │   │   └── 📁 oauth/      # OAuth callbacks
│   │   │   │   │   ├── 📁 (home)/        # Main application
│   │   │   │   │   │   ├── 📁 home/       # Dashboard & bookmarks
│   │   │   │   │   │   └── 📁 _components/ # Home-specific components
│   │   │   │   │   └── 📁 (shared)/      # Public bookmark sharing
│   │   │   │   │       └── 📁 s/[username]/ # Public user pages
│   │   │   │   ├── 📁 _common/           # Shared application code
│   │   │   │   │   ├── 📁 actions/       # Server actions
│   │   │   │   │   ├── 📁 components/    # Reusable components
│   │   │   │   │   ├── 📁 hooks/         # Custom React hooks
│   │   │   │   │   ├── 📁 providers/     # React context providers
│   │   │   │   │   └── 📁 state/         # State management
│   │   │   │   └── 📁 _core/             # Core utilities
│   │   │   │       ├── 📁 components/    # Base UI components
│   │   │   │       └── 📁 utils/         # Utility functions
│   │   │   ├── 📁 styles/                # Global styles
│   │   │   └── 📄 middleware.ts          # Next.js middleware
│   │   ├── 📁 public/                    # Static assets
│   │   │   ├── 📁 images/                # Application images
│   │   │   ├── 📁 logos/                 # Brand assets
│   │   │   ├── 📄 manifest.json          # PWA manifest
│   │   │   └── 📄 sw.js                  # Service worker
│   │   ├── 📄 next.config.mjs            # Next.js configuration
│   │   ├── 📄 tailwind.config.ts         # Tailwind CSS configuration
│   │   └── 📄 package.json
│   │
│   └── 📁 server/                 # NestJS Backend Application
│       ├── 📁 src/
│       │   ├── 📁 iam/            # Identity & Access Management
│       │   │   ├── 📁 authentication/    # Auth controllers & services
│       │   │   ├── 📁 guards/            # Security guards
│       │   │   ├── 📁 decorators/        # Custom decorators
│       │   │   └── 📁 social/            # OAuth providers
│       │   ├── 📁 bookmarks/      # Bookmark management
│       │   │   ├── 📁 dto/               # Data transfer objects
│       │   │   ├── 📁 entities/          # Database entities
│       │   │   ├── 📁 services/          # Business logic
│       │   │   └── 📄 bookmarks.controller.ts
│       │   ├── 📁 categories/     # Category management
│       │   ├── 📁 users/          # User management
│       │   ├── 📁 common/         # Shared utilities
│       │   │   ├── 📁 entities/          # Base entities
│       │   │   └── 📁 constants/         # Application constants
│       │   ├── 📁 migrations/     # Database migrations
│       │   ├── 📄 main.ts         # Application entry point
│       │   └── 📄 data-source.ts  # Database configuration
│       ├── 📄 Dockerfile          # Container configuration
│       └── 📄 package.json
│
├── 📁 packages/                   # Shared Configurations
│   ├── 📁 eslint-config/          # Shared ESLint configuration
│   ├── 📁 prettier-config/        # Shared Prettier configuration
│   └── 📁 typescript-config/      # Shared TypeScript configuration
│
├── 📄 docker-compose.yml          # Development environment
├── 📄 turbo.json                  # Turborepo configuration
├── 📄 pnpm-workspace.yaml         # pnpm workspace configuration
├── 📄 CLAUDE.md                   # AI assistant instructions
└── 📄 README.md                   # This file
```

## ⚙️ Installation

### Prerequisites

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **pnpm** 8.9.2 or higher (`npm install -g pnpm@8.9.2`)
- **Docker** & Docker Compose ([Download](https://docs.docker.com/get-docker/))
- **Git** for version control

### Quick Start

#### Option 1: Automated Setup (Recommended)

```bash
git clone https://github.com/yourusername/bookmarket.git
cd bookmarket
./setup.sh
```

The setup script will:

- ✅ Check prerequisites (Node.js 18+, pnpm, Docker)
- ✅ Install dependencies
- ✅ Create environment files from examples
- ✅ Start PostgreSQL database
- ✅ Run database migrations
- ✅ Provide next steps

#### Option 2: Manual Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/bookmarket.git
   cd bookmarket
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Configuration**

   ```bash
   # Copy environment examples
   cp apps/web/.env.example apps/web/.env
   cp apps/server/.env.example apps/server/.env
   ```

4. **Configure Environment Variables**

   **Frontend (`apps/web/.env`)**:

   ```env
   # Base Configuration
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:8000

   # OAuth Configuration
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id

   # Optional: Error Monitoring
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
   ```

   **Backend (`apps/server/.env`)**:

   ```env
   # Database Configuration
   DATABASE_URL=
   POSTGRES_USER=
   POSTGRES_PASSWORD=
   POSTGRES_DB=

   # JWT Configuration
   JWT_SECRET=
   JWT_TOKEN_AUDIENCE=
   JWT_TOKEN_ISSUER=
   JWT_ACCESS_TOKEN_TTL=
   JWT_REFRESH_TOKEN_TTL=

   # OAuth Secrets
   GOOGLE_CLIENT_SECRET=
   GITHUB_CLIENT_SECRET=

   # Optional: Error Monitoring
   SENTRY_DSN=
   ```

5. **Start Development Environment**

   ```bash
   # Starts PostgreSQL + Frontend + Backend
   pnpm dev
   ```

6. **Setup Database** (First time only)

   ```bash
   cd apps/server
   pnpm run migration:run
   ```

7. **Access the Application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000
   - **Database**: localhost:5432

## 💻 Development

### Development Commands

```bash
# Start full development environment (DB + Web + Server)
pnpm dev

# Start individual services
pnpm --filter bookmarket-client dev    # Frontend only
pnpm --filter bookmarket-server dev    # Backend only

# Database only (useful for external API testing)
docker compose up db -d
```

### Development Workflow

1. **Feature Development**: Create feature branches from `main`
2. **Code Quality**: Run linting and type checking before commits
3. **Database Changes**: Generate migrations for schema changes
4. **Testing**: Run backend tests before pushing
5. **Build Verification**: Ensure production build works

### Hot Reloading & Live Updates

- **Frontend**: Automatic hot reloading with Next.js Fast Refresh
- **Backend**: Automatic restart with NestJS watch mode
- **Database**: Persistent data with Docker volumes
- **Types**: Shared TypeScript types with automatic regeneration

## 📖 API Documentation

### Authentication Flow

The API uses **JWT-based authentication** with **HTTP-only cookies** for
security:

1. **Sign Up/Sign In**: Returns access & refresh tokens
2. **Cookie Storage**: Tokens stored in secure HTTP-only cookies
3. **Automatic Refresh**: Seamless token refresh on expiration
4. **OAuth Integration**: Google & GitHub OAuth providers

### Base URLs

- **Development**: `http://localhost:8000`
- **Production**: Your deployed backend URL

### Authentication Endpoints

#### `POST /authentication/signup`

Creates a new user account with email/password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "strongPassword123",
  "picture": "https://example.com/avatar.jpg" // optional
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": null,
    "firstName": null,
    "lastName": null,
    "picture": "https://example.com/avatar.jpg",
    "isPublic": false,
    "auth_provider": "email"
  },
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token"
}
```

#### `POST /authentication/signin`

Authenticates existing user with email/password.

#### `POST /authentication/refresh-token`

Refreshes expired access tokens.

#### `POST /authentication/google`

Authenticates user via Google OAuth.

#### `POST /authentication/github`

Authenticates user via GitHub OAuth.

### User Management Endpoints

#### `GET /users/me`

Returns current authenticated user's profile.

**Response:**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "picture": "https://example.com/avatar.jpg",
  "isPublic": true
}
```

#### `PATCH /users`

Updates current user's profile.

**Request Body:**

```json
{
  "username": "newusername", // max 12 characters
  "firstName": "John", // max 50 characters
  "lastName": "Doe" // max 50 characters
}
```

#### `GET /users/check-username?username=johndoe`

Checks username availability for current user.

### Bookmark Management Endpoints

#### `POST /bookmarks`

Creates a new bookmark with automatic metadata fetching.

**Request Body:**

```json
{
  "url": "https://example.com",
  "title": "Custom Title", // optional, auto-fetched if not provided
  "description": "Description", // optional, auto-fetched if not provided
  "faviconUrl": "https://...", // optional, auto-fetched if not provided
  "category": "Work" // optional, creates category if not exists
}
```

**Response:**

```json
{
  "id": "uuid",
  "url": "https://example.com",
  "title": "Example Site",
  "description": "An example website",
  "faviconUrl": "https://example.com/favicon.ico",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "category": {
    "id": "uuid",
    "name": "Work"
  }
}
```

#### `GET /bookmarks`

Retrieves all bookmarks for authenticated user.

**Query Parameters:**

- `category` (optional): Filter by category name

#### `GET /bookmarks/metadata?url=https://example.com`

Fetches metadata for a given URL without creating bookmark.

**Response:**

```json
{
  "title": "Example Site",
  "description": "An example website",
  "faviconUrl": "https://example.com/favicon.ico"
}
```

#### `PATCH /bookmarks/:id`

Updates existing bookmark.

#### `PATCH /bookmarks/:id/category`

Assigns bookmark to a specific category.

#### `DELETE /bookmarks/:id`

Deletes bookmark.

### Category Management Endpoints

#### `POST /categories`

Creates a new category.

**Request Body:**

```json
{
  "name": "Work Projects"
}
```

#### `GET /categories`

Retrieves all categories for authenticated user.

#### `PATCH /categories/:id`

Updates category name.

#### `DELETE /categories/:id`

Deletes category (bookmarks become uncategorized).

### Public Sharing Endpoints

#### `GET /bookmarks/s/:username`

Retrieves public bookmarks for a user (no authentication required).

**Query Parameters:**

- `category` (optional): Filter by category name

#### `GET /categories/s/:username`

Retrieves public categories for a user (no authentication required).

### Error Responses

All endpoints return consistent error responses:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## 🗄️ Database

### Database Schema

#### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  username VARCHAR(12) UNIQUE,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  picture VARCHAR,
  password_hash VARCHAR, -- For email auth
  google_id VARCHAR,     -- For Google OAuth
  github_id VARCHAR,     -- For GitHub OAuth
  auth_provider VARCHAR NOT NULL, -- 'email' | 'google' | 'github'
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Categories Table

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(name, user_id) -- Unique category names per user
);
```

#### Bookmarks Table

```sql
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT,
  favicon_url VARCHAR,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Database Operations

#### Migration Management

```bash
cd apps/server

# Generate new migration after entity changes
pnpm run migration:generate MigrationName

# Run pending migrations
pnpm run migration:run

# Revert last migration
pnpm run migration:revert

# Check migration status
pnpm run typeorm migration:show
```

#### Database Development

```bash
# Start database only
docker compose up db -d

# Connect to database
docker exec -it bookmarket-db-1 psql -U bokdol -d bookmarket

# View logs
docker compose logs db -f

# Reset database (⚠️ Destructive)
docker compose down -v
docker compose up db -d
cd apps/server && pnpm run migration:run
```

### Entity Relationships

```
Users (1) ────── (N) Categories
  │
  └── (1) ────── (N) Bookmarks ────── (N) Categories
                                  └── (1)
```

- **One user** can have **many categories**
- **One user** can have **many bookmarks**
- **One category** can have **many bookmarks**
- **One bookmark** belongs to **one category** (optional)

## 🚀 Deployment

### Docker Production Deployment

1. **Prepare Environment Files**

   ```bash
   # Production environment variables
   cp apps/web/.env.example apps/web/.env.production
   cp apps/server/.env.example apps/server/.env.production

   # Update with production values
   vim apps/web/.env.production
   vim apps/server/.env.production
   ```

2. **Build and Deploy**

   ```bash
   # Build production containers
   docker compose -f docker-compose.prod.yml build

   # Start production services
   docker compose -f docker-compose.prod.yml up -d

   # Run database migrations
   docker compose -f docker-compose.prod.yml exec server pnpm run migration:run
   ```

### Vercel + Railway Deployment

**Frontend (Vercel):**

1. Connect GitHub repository to Vercel
2. Set build command: `cd apps/web && pnpm build`
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push to main

**Backend (Render.io):**

1. Connect GitHub repository to Render.io
2. Set start command: `cd apps/server && pnpm run start:prod`
3. Set environment variables in Render dashboard

### Environment Variables for Production

**Critical Production Variables:**

- `JWT_SECRET` - Strong, unique secret key
- `DATABASE_URL` - Production database connection
- `NEXT_PUBLIC_BASE_URL` - Your frontend domain
- OAuth client secrets
- Sentry DSN for error tracking

### Health Checks & Monitoring

The application includes:

- **Database health checks** in Docker Compose
- **Sentry error monitoring** for both frontend and backend
- **PostgreSQL connection monitoring**
- **JWT token validation**

## 🔒 Security

### Security Features

#### Frontend Security

- **Content Security Policy (CSP)** configured in `next.config.mjs`
- **Security Headers**: XSS Protection, Frame Options, Content Type Options
- **HTTP-only Cookies** for JWT token storage
- **HTTPS enforcement** in production
- **Input sanitization** for all user inputs
- **Image security** with allowlist for external images

#### Backend Security

- **JWT Authentication** with refresh token rotation
- **Password hashing** with bcrypt (12 rounds)
- **CORS configuration** for cross-origin requests
- **Rate limiting** on authentication endpoints
- **SQL injection prevention** with TypeORM parameterized queries
- **Input validation** with class-validator decorators
- **Helmet.js** for additional security headers

#### Database Security

- **Connection encryption** with SSL in production
- **User access controls** with PostgreSQL roles
- **Data encryption at rest** (depends on hosting provider)
- **Regular backup strategies** recommended

### Security Best Practices

1. **Never commit secrets** to version control
2. **Use environment variables** for all configuration
3. **Rotate JWT secrets** periodically
4. **Monitor authentication logs** for suspicious activity
5. **Keep dependencies updated** with security patches
6. **Use HTTPS in production** with valid SSL certificates

## 📱 PWA Features

### Progressive Web App Capabilities

The application is a full-featured PWA with:

#### Installation

- **Add to Home Screen** on mobile devices
- **Desktop installation** via browser
- **Custom app icons** and splash screens
- **Standalone display mode** (no browser UI)

#### Offline Support

- **Service Worker** caches static assets
- **Offline fallback pages** when network unavailable
- **Background sync** for bookmark creation when back online
- **Cache-first strategy** for optimal performance

#### Native-like Experience

- **Push notifications** (ready for implementation)
- **Background app refresh**
- **Native app-like navigation**
- **Device integration** (camera, sharing, etc.)

### PWA Configuration

**Manifest (`public/manifest.json`):**

```json
{
  "name": "Bookmarket",
  "short_name": "Bookmarket",
  "description": "Modern bookmark management",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/logos/logo-base-256x256.png",
      "sizes": "256x256",
      "type": "image/png"
    }
  ]
}
```

**Service Worker Features:**

- Workbox-powered service worker
- Automatic asset caching
- Runtime caching strategies
- Background sync capabilities

## 🧪 Testing

### Backend Testing

```bash
cd apps/server

# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage report
pnpm test:cov

# Run end-to-end tests
pnpm test:e2e

# Run specific test file
pnpm test -- bookmarks.service.spec.ts
```

### Test Structure

```
apps/server/src/
├── bookmarks/
│   ├── __tests__/
│   │   ├── bookmarks.controller.spec.ts
│   │   └── bookmarks.service.spec.ts
│   └── ...
├── categories/
│   ├── __tests__/
│   └── ...
└── test/                 # E2E tests
    ├── app.e2e-spec.ts
    └── auth.e2e-spec.ts
```

### Testing Guidelines

1. **Unit Tests**: Test individual functions and methods
2. **Integration Tests**: Test API endpoints and database interactions
3. **E2E Tests**: Test complete user workflows
4. **Mocking**: Mock external dependencies (database, HTTP requests)
5. **Coverage**: Aim for >80% code coverage on critical paths

### Frontend Testing (Future Enhancement)

Recommended setup for frontend testing:

- **Vitest** for unit testing
- **React Testing Library** for component testing
- **Playwright** for E2E testing
- **MSW** for API mocking

## 🧹 Code Quality

### Linting & Formatting

```bash
# Run linting across all packages
pnpm lint

# Fix auto-fixable linting issues
pnpm lint --fix

# Format code with Prettier
pnpm format

# Type checking across all packages
pnpm check-types
```

### Code Quality Tools

#### ESLint Configuration

- **TypeScript ESLint** rules
- **React/Next.js** specific rules
- **Import/export** organization
- **Unused imports** detection
- **Custom rules** for project conventions

#### Prettier Configuration

- **Consistent formatting** across all files
- **Tailwind CSS** class sorting
- **Import sorting** with custom order
- **Line length limits** and spacing rules

#### TypeScript Configuration

- **Strict mode** enabled
- **Path mapping** for clean imports
- **Shared configurations** across packages
- **Build-time type checking**

### Pre-commit Hooks (Recommended)

```bash
# Install husky for git hooks
pnpm add -D husky lint-staged

# Setup pre-commit hook
npx husky add .husky/pre-commit "pnpm lint-staged"
```

## 🔧 Troubleshooting

### Common Issues & Solutions

#### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker compose ps

# View database logs
docker compose logs db

# Reset database connection
docker compose restart db

# Check database connectivity
docker compose exec db pg_isready -U bokdol -d bookmarket
```

#### Port Already in Use

```bash
# Find process using port 3000/8000
lsof -ti:3000
lsof -ti:8000

# Kill process using port
kill -9 $(lsof -ti:3000)

# Or use different ports
NEXT_PUBLIC_PORT=3001 pnpm dev
```

#### Node.js Version Issues

```bash
# Check Node.js version (needs 18+)
node --version

# Use Node Version Manager
nvm install 18
nvm use 18

# Or use Volta
volta install node@18
```

#### pnpm Installation Issues

```bash
# Install pnpm globally
npm install -g pnpm@8.9.2

# Clear pnpm cache
pnpm store prune

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### Migration Issues

```bash
# Check migration status
cd apps/server
pnpm run typeorm migration:show

# Revert problematic migration
pnpm run migration:revert

# Generate new migration
pnpm run migration:generate FixIssue
```

#### OAuth Configuration Issues

1. **Google OAuth**: Ensure redirect URIs match in Google Console
2. **GitHub OAuth**: Check OAuth app settings in GitHub
3. **Environment Variables**: Verify all OAuth secrets are set correctly
4. **CORS Issues**: Ensure frontend URL is allowed in backend CORS settings

#### Build Issues

```bash
# Clear Next.js cache
rm -rf apps/web/.next

# Clear TypeScript cache
rm -rf apps/web/.tsbuildinfo

# Rebuild everything
pnpm clean
pnpm install
pnpm build
```

### Development Tips

1. **Hot Reload Not Working**: Restart development server
2. **Database Schema Changes**: Always generate migrations
3. **Environment Variables**: Restart server after changes
4. **TypeScript Errors**: Check import paths and type definitions
5. **Docker Issues**: Try `docker system prune` to clean up

### Getting Help

- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Check CLAUDE.md for AI assistant guidance
- **Community**: Join discussions in GitHub Discussions
- **Logs**: Always check browser console and server logs for errors

## 🤝 Contributing

We welcome contributions to Bookmarket! Here's how to get started:

### Development Setup

1. **Fork & Clone**

   ```bash
   git clone https://github.com/yourusername/bookmarket.git
   cd bookmarket
   ```

2. **Install Dependencies**

   ```bash
   pnpm install
   ```

3. **Setup Development Environment**

   ```bash
   cp apps/web/.env.example apps/web/.env
   cp apps/server/.env.example apps/server/.env
   # Update environment variables
   ```

4. **Start Development**
   ```bash
   pnpm dev
   ```

### Contribution Guidelines

#### Code Standards

- **TypeScript**: All code must be properly typed
- **Linting**: Pass ESLint checks (`pnpm lint`)
- **Formatting**: Use Prettier (`pnpm format`)
- **Testing**: Add tests for new features
- **Documentation**: Update README for significant changes

#### Git Workflow

1. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
2. **Make Changes**: Follow code standards and best practices
3. **Test Changes**: Ensure all tests pass
4. **Commit Changes**: Use conventional commit messages
5. **Push Branch**: `git push origin feature/amazing-feature`
6. **Open Pull Request**: Describe changes and link related issues

#### Commit Message Format

```
type(scope): description

feat(bookmarks): add bulk bookmark import
fix(auth): resolve OAuth callback redirect issue
docs(readme): update installation instructions
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Areas for Contribution

#### High Priority

- **Testing**: Add frontend tests with Vitest
- **Performance**: Optimize bundle size and loading times
- **Accessibility**: Improve keyboard navigation and screen reader support
- **Mobile**: Enhance mobile user experience

#### Medium Priority

- **Features**: Bookmark import/export, search functionality
- **Documentation**: API documentation, deployment guides
- **Monitoring**: Enhanced error tracking and analytics
- **Internationalization**: Multi-language support

#### Nice to Have

- **Browser Extension**: Chrome/Firefox bookmark sync
- **Themes**: Additional color schemes and themes
- **Integrations**: Pocket, Instapaper, other bookmark services
- **Analytics**: User dashboard with bookmark statistics

### Review Process

1. **Automated Checks**: CI/CD runs tests and linting
2. **Code Review**: Maintainers review for quality and standards
3. **Testing**: Manual testing for UI/UX changes
4. **Documentation**: Ensure documentation is updated
5. **Merge**: Approved PRs are merged to main branch

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE)
file for details.

### MIT License Summary

- ✅ **Commercial use** allowed
- ✅ **Modification** allowed
- ✅ **Distribution** allowed
- ✅ **Private use** allowed
- ❌ **Liability** - No warranty provided
- ❌ **Warranty** - Use at your own risk

---

## 📧 Support & Contact

### Getting Help

- **📖 Documentation**: Start with this README and CLAUDE.md
- **🐛 Bug Reports**:
  [Open an issue](https://github.com/yourusername/bookmarket/issues)
- **💡 Feature Requests**:
  [Submit an enhancement](https://github.com/yourusername/bookmarket/issues)
- **💬 Discussions**:
  [Join community discussions](https://github.com/yourusername/bookmarket/discussions)

### Maintainers

- **Eric Park** - [@eric-jy-park](https://github.com/eric-jy-park)

### Acknowledgments

Special thanks to the amazing open-source projects that make Bookmarket
possible:

- Next.js team for the incredible React framework
- NestJS community for the robust backend framework
- Vercel for deployment and hosting solutions
- All contributors and users who help improve Bookmarket

---
